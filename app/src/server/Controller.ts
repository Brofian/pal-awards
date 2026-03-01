import type {ServerWebSocket} from "bun";
import serverSocketHandler, {type SocketData} from "@/server/util/ServerSocketHandler.ts";
import logger from "@/server/util/Logger.ts";

/**
 * This file is the entry point for the Websocket Server. It receives the pure events from bun to handle.
 * As this class should only ever be instantiated once, it is exported as a singleton
 */
class ServerController {

    public open(ws: ServerWebSocket<SocketData>): void {
        // initialize socket data
        ws.data.connectionUUID = Bun.randomUUIDv7();
        logger.debug(`Connection open: ${ws.data.connectionUUID}`);
        serverSocketHandler.onConnection(ws);
    }

    public message(ws: ServerWebSocket<SocketData>, message: string | Buffer<ArrayBuffer>): void {
        logger.debug(`Connection message: ${ws.data.connectionUUID} : ${message}`);
        serverSocketHandler.onMessageReceived(ws, String(message))
    }

    public close(ws: ServerWebSocket<SocketData>, code: number, reason: string): void {
        logger.debug(`Connection closed: ${ws.data.connectionUUID} (code: ${code}, reason: ${reason || '-'})`);
    }

}

// create and export singleton
const serverController = new ServerController();
export default serverController;
