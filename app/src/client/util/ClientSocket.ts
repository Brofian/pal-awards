import SimpleEventTarget from "@/shared/events/SimpleEventTarget.ts";
import type {
    ServerToClientPacket,
    ServerToClientPacketName,
    ServerToClientPackets
} from "@/shared/socket/packets/ServerToClientPackets.ts";
import type {
    ClientToServerPacket,
    ClientToServerPacketName,
    ClientToServerPackets
} from "@/shared/socket/packets/ClientToServerPackets.ts";
import logger from "@/client/util/Logger.ts";
import {concatString, type PrefixKeys} from "@/shared/util/TypeHelpers.ts";


export function packetNameToReceivedEvent(packetName: ServerToClientPacketName) {
    return concatString('received-', packetName);
}


export type ClientSocketEvents = {
    "connection-changed": { isOpen: boolean, isError: boolean },
} & PrefixKeys<"received-", ServerToClientPackets>;

/**
 *  The singleton class for creating and handling the websocket connection on the client side
 *
 *  If you want to subscribe to receiving a packet from the server, you can use event "received-<packet-name>"
 *
 */
class ClientSocket extends SimpleEventTarget<ClientSocketEvents> {

    private readonly connection: WebSocket;

    public constructor() {
        super();

        // use the current location to determine the url for the websocket (by just replacing the path)
        const {protocol, hostname, port} = window.location;
        const websocketUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}/ws`;
        this.connection = new WebSocket(websocketUrl);

        // attach event listeners
        this.connection.addEventListener('open', this.onConnectionOpen.bind(this));
        this.connection.addEventListener('close', this.onConnectionClose.bind(this));
        this.connection.addEventListener('error', this.onConnectionError.bind(this));
        this.connection.addEventListener('message', this.onConnectionMessage.bind(this));
    }

    public isConnected(): boolean {
        return this.connection.readyState === this.connection.OPEN;
    }

    public sendPacket<K extends ClientToServerPacketName>(packetName: K, packetData: ClientToServerPackets[K]): void {
        if (!this.isConnected()) {
            logger.error(`Tried to send packet "${packetName}" without established connection`);
            return;
        }
        const packet: ClientToServerPacket = {type: packetName, data: packetData};
        this.connection.send(JSON.stringify(packet));
    }

    private onConnectionOpen(_event: Event): void {
        logger.debug("Connection open");
        this.dispatch('connection-changed', {isOpen: true, isError: false});
    }

    private onConnectionClose(_event: CloseEvent): void {
        logger.debug("Connection close");
        this.dispatch('connection-changed', {isOpen: false, isError: false});
    }

    private onConnectionError(_event: Event): void {
        logger.debug("Connection error");
        this.dispatch('connection-changed', {isOpen: false, isError: true});
    }

    private onConnectionMessage(_event: MessageEvent<string>): void {
        try {
            if (_event.data) {
                const packet = JSON.parse(_event.data) as ServerToClientPacket;
                const eventName = packetNameToReceivedEvent(packet.type);
                this.dispatch(eventName, packet.data);
            }
        }
        catch (error) {
            logger.error(`Failed to parse message into packet: "${_event.data}"`, error);
        }
    }
}

const clientSocket = new ClientSocket();
export default clientSocket;