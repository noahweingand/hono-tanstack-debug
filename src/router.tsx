import { createRouter as createReactRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { useRef } from "react";

export function createRouter() {
    // TODO: fix lazy typing
    const ref: { current: any } = { current: null };

    const router = createReactRouter({
        routeTree,
        context: {
            assets: { js: [], css: [] },
            requestId: ''
        },
        // defaultPreload: false,
        scrollRestoration: true,
        notFoundMode: "root",
        dehydrate: () => {
            console.log("router dehydrated", ref.current);
            return {
                requestId: ref.current.options.context.requestId
            }
        },
        hydrate: (dehydrated) => {
            console.log("dehydrated data on hydrate", dehydrated)
            ref.current.update({
                context: {
                    ...ref.current.options.context,
                    requestId: dehydrated.requestId
                }
            })
        }
    });

    ref.current = router;

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