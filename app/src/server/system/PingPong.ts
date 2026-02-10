import serverSocketHandler from "@/server/util/ServerSocketHandler.ts";

export function pingPongHandler(): void {
    // Ping-Pong example
    serverSocketHandler.on("received-ping", (pingEvent) => {
        if (!pingEvent.detail) return;
        const {ws, data} = pingEvent.detail;

        serverSocketHandler.sendPacketToSocket(ws, "pong", {
            num: data.num + 1
        });
    });
}