import path from "node:path";
import url from "node:url";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import type { BuildEnvironmentOptions } from "vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ssrConfig: BuildEnvironmentOptions = {
    ssr: true,
    outDir: "dist/server",
    ssrEmitAssets: true,
    copyPublicDir: false,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
        input: {
            entry: path.resolve(__dirname, "src/server/entry-server.ts"),
            server: path.resolve(__dirname, "src/server/index.ts")
        },
        output: {
            entryFileNames: "[name].js",
            chunkFileNames: "assets/[name]-[hash].js",
            assetFileNames: "assets/[name][external]"
        }
    }
};

const clientConfig: BuildEnvironmentOptions = {
    outDir: "dist/client",
    emitAssets: true,
    copyPublicDir: true,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
        input: path.resolve(__dirname, "src/entry-client.tsx"),
        output: {
            entryFileNames: "[name].js",
            chunkFileNames: "assets/[name]-[hash].js",
            assetFileNames: "assets/[name][external]"
        }
    }
};

export default defineConfig((config) => {
    return {
        plugins: [
            tanstackRouter({ target: "react", autoCodeSplitting: true }),
            react(),
            tailwindcss()
        ],
        build: config.isSsrBuild ? ssrConfig : clientConfig,
        mode: config.mode
    }
})