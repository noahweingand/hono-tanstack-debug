import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { RouterContext } from '../router'

export const Route = createRootRouteWithContext<RouterContext>()({
    // beforeLoad: ((i) => {
    //     console.log("root route context beforeLoad - requestId", i.context.requestId);
    //     // return i.context;
    // }),
    loader: (({ context }) => {
        console.log("root route context loader", context);
        return { context };
    }),
    head: (i) => {
        const js = i.match.context.assets.js?.map((script) => ({ type: "module", src: script }));
        const css = import.meta.env.MODE === "production" ? (i.match.context.assets.css?.map((href) => ({ rel: "stylesheet", href }))) : [];

        return {
            links: css,
            meta: [
                { title: "Hey yo!" },
                { charSet: "UTF-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1.0" }
            ],
            scripts: [
                ...(import.meta.env.PROD ? [] : [
                    {
                        type: 'module',
                        children: `import RefreshRuntime from "/@react-refresh"
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true`,
                    },
                    {
                        type: 'module',
                        src: '/@vite/client',
                    },
                ]),
                ...js
            ]
        }
    },
    component: RootComponent,
    notFoundComponent: () => <div>Not found!</div>
})

function RootComponent() {
    const { context } = Route.useLoaderData();
    console.log("root route component loader context", context);

    return (
    <html lang="en">
        <head>
        <HeadContent />
        </head>
        <body>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
        </body>
    </html>
    )
}