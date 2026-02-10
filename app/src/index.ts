import {serve} from "bun";
import index from "./client/_public/index.html";
import serverController from "@/server/Controller.ts";
import type {SocketData} from "@/server/util/ServerSocketHandler.ts";
import migrateDatabase from "@/server/database/Migrate.ts";
import logger from "@/server/util/Logger.ts";
import executeSystemHandlers from "@/server/SystemRegistry.ts";

const HTTP_PORT = Bun.env.HTTP_PORT || 3000;

const server = serve<SocketData>({
    port: HTTP_PORT,

    // Forward all websocket events to the server controller
    websocket: {
        open: serverController.open.bind(serverController),
        message: serverController.message.bind(serverController),
        close: serverController.close.bind(serverController)
    },

    // HTTP Fetch Handler
    async fetch(req, server) {
        const url = new URL(req.url);

        // Handle WebSocket Upgrades (HTTP -> WS)
        if (url.pathname === "/ws") {
            const upgraded = server.upgrade(req, {
                data: {
                    uuid: undefined
                } as SocketData
            });
            if (upgraded) return undefined; // Bun takes over the connection
        }

        // Let the routes handle all other requests
        return undefined;
    },

    routes: {
        // Serve index.html for all unmatched routes.
        "/*": index,

        "/api/health": {
            async GET() {
                return Response.json({
                    status: "OK"
                });
            },
        },
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,
        // Echo console logs from the browser to the server
        console: true,
    },
});

await migrateDatabase();
await executeSystemHandlers();

logger.info(`Server running at ${server.url}`);
