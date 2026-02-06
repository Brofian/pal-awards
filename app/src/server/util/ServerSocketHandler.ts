import SimpleEventTarget from "@/shared/events/SimpleEventTarget.ts";
import type {ClientToServerPacket, ClientToServerPackets} from "@/shared/socket/packets/ClientToServerPackets.ts";
import logger from "@/server/util/Logger.ts";
import type {PrefixKeys, WrapValues} from "@/shared/util/TypeHelpers.ts";
import type {ServerWebSocket} from "bun";

/**
 * The internal payload data that each socket carries
 */
export type SocketData = {
    uuid?: string,
}

/**
 * Create the events from the available c2s packets
 *
 * For every event "ping" with payload data {num: number}, we get an event:
 * "received-ping": {
 *      ws: ...,
 *      data: {num: number}
 * }
 * */
type PacketReceivedEvents = WrapValues<PrefixKeys<"received-", ClientToServerPackets>, {
    ws: ServerWebSocket<SocketData>
}>;


type ServerSocketEvents = {
    // space for more events in the future
} & PacketReceivedEvents;

/**
 * This class singleton is responsible for handling sockets and managing packets
 *
 *  If you want to subscribe to receiving a packet from the client, you can use event "received-<packet-name>"
 */
class ServerSocketHandler extends SimpleEventTarget<ServerSocketEvents> {

    onMessageReceived(ws: ServerWebSocket<SocketData>, message: string): void {
        try {
            const packet = JSON.parse(message) as ClientToServerPacket;
            // we know that "received-" + (keyof ClientToServerPackets) is the correct type. But TypeScript
            // does not infer from string concatenations. So we have to convince it!
            const packetEvent = `received-${packet.type}` as `received-${keyof ClientToServerPackets}`;
            this.dispatch(packetEvent, {
                ws: ws,
                data: packet.data
            });
        } catch (_error) {
            logger.error("Received malform packet: ", message);
        }
    }

}

const serverSocketHandler = new ServerSocketHandler();
export default serverSocketHandler;