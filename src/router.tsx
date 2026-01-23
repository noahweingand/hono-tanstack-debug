import { createRouter as createReactRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen"

export function createRouter(initialContext: RouterContext) {
    const router = createReactRouter({
        routeTree,
        context: initialContext,
        // defaultPreload: false,
        scrollRestoration: true,
        notFoundMode: "root",
        dehydrate: () => initialContext,
        hydrate: (dehydrated) => {
            router.update({
                context: {
                    ...initialContext,
                    requestId: dehydrated.requestId ?? initialContext.requestId,
                },
            })
        }
    });

    return router;
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