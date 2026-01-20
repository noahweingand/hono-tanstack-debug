import { createRouter as createReactRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function createRouter() {
    return createReactRouter({
        routeTree,
        context: {
            assets: { js: [], css: [] },
        },
        // defaultPreload: false,
        scrollRestoration: true,
        notFoundMode: "root",
    });
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}

export interface RouterContext {
    assets: { js: string[]; css: string[]; }
    requestId?: string;
}