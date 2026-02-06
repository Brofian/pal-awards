import SimpleEventTarget from "@/shared/events/SimpleEventTarget.ts";
import type {ServerToClientPacket} from "@/shared/socket/packets/ServerToClientPackets.ts";
import type {ClientToServerEventName, ClientToServerPackets} from "@/shared/socket/packets/ClientToServerPackets.ts";
import logger from "@/client/util/Logger.ts";
import type {PrefixKeys} from "@/shared/util/TypeHelpers.ts";

export type ClientSocketEvents = {
    "connection-changed": { isOpen: boolean, isError: boolean },
} & PrefixKeys<"received-", ServerToClientPacket>;

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

    public sendPacket<K extends ClientToServerEventName>(type: K, data: ClientToServerPackets[K]): void {
        if (!this.isConnected()) {
            logger.error(`Tried to send packet "${type}" without established connection`);
            return;
        }
        this.connection.send(JSON.stringify(data));
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

    private onConnectionMessage(_event: MessageEvent<ServerToClientPacket>): void {
        logger.debug("Connection message: ", _event.data);
        if (_event.data) {
            // we know that "received-" + (keyof ServerToClientPacket) is the correct type. But TypeScript
            // does not infer from string concatenations. So we have to convince it!
            const packetEvent = `received-${_event.data.type}` as `received-${keyof ServerToClientPacket}`;
            this.dispatch(packetEvent, _event.data.data);
        }
    }
}

const clientSocket = new ClientSocket();
export default clientSocket;