import crypto from "node:crypto";
import { createRequestHandler, defaultStreamHandler } from "@tanstack/react-router/ssr/server";

import { createRouter } from "../router";

export function render({
    request,
    assets
}: {
    request: Request;
    assets: { js: string[]; css: string[]; }
}) {
    const requestId = crypto.randomUUID();

    const handler = createRequestHandler({
        request,
        createRouter: () => createRouter({
            assets,
            requestId
        })
    });

    return handler(defaultStreamHandler);
}