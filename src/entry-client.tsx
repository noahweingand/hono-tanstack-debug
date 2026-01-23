import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";

import { createRouter } from "./router";

const initialContext = {
    assets: { css: [], js: [] },
    requestId: ''
}

const router = createRouter(initialContext);

hydrateRoot(document, <RouterClient router={router} />)