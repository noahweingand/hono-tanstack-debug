import { serve } from "@hono/node-server";

import app from "./app";

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3200 }, ( info ) =>
    console.info(`Server listening on port ${info.port}`)
)