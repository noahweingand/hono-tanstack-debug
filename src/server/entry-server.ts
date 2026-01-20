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
        createRouter: () => {
            const router = createRouter();

            router.update({
                context: {
                    ...router.options.context,
                    assets,
                    requestId
                }
            });

            console.info({ context: { ...router.options.context }}, "ssr");

            return router;
        }
    });

    return handler(defaultStreamHandler);
}