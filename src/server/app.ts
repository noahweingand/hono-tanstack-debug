import fs from "node:fs";

import { type Context, Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { Manifest, ViteDevServer } from "vite";
import type { HttpBindings } from "@hono/node-server";

import type { render } from "./entry-server";

function getInitialAssets() {
  const content = fs.readFileSync(`${process.cwd()}/dist/client/manifest.json`, 'utf-8');
  const manifest: Manifest = JSON.parse(content);
  const entry = manifest["src/entry-client.tsx"];

  if (!entry) {
    throw new Error("No client entry on initial assets");
  }

  if (!entry?.css || entry.css.length === 0) {
    throw new Error("Missing css property from client entry manifest chunk");
  }

  return {
    js: [entry.file].filter(Boolean),
    css: entry.css.filter(Boolean)
  }
}

let vite: ViteDevServer | undefined;
async function getServerEntry(): Promise<typeof render> {
    if (import.meta.env.MODE === "production") {
        // @ts-expect-error TODO: figure out later
        return (await import ("../../dist/server/entry-server.js")).render as typeof render;
    }

    return (await vite?.ssrLoadModule("/src/server/entry-server.ts"))?.render
}

async function getRenderParams(c: Context) {
    const test = c.req;
    return {
        request: c.req.raw,
        assets: import.meta.env.MODE === 'production' ? getInitialAssets() : { js: ['/src/entry-client.js'], css: ['/src/index.css']}
    }
}

async function getRender(c: Context) {
    return { ...(await getRenderParams(c)) };
}

const app = new Hono();

app.onError((err, c) => {
    console.error(err);

    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.text("Internal Server Error", 500);
});

if (import.meta.env.MODE === "development") {
    vite = await (await import("vite")).createServer({
        server: { middlewareMode: true, watch: { usePolling: true, interval: 100 }},
        appType: "custom"
    });

    app.use('*', createMiddleware<{ Bindings: HttpBindings }>(async (ctx, next) => {
        await new Promise((resolve) => { vite?.middlewares(ctx.env.incoming, ctx.env.outgoing, resolve) })
        return next();
    }));
}

app.use("*", async (c) => {
    return (await getServerEntry())(await getRender(c));
});

export default app;