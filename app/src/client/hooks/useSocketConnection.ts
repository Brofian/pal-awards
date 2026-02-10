import clientSocket from "@/client/util/ClientSocket.ts";
import useEvent from "@/client/hooks/useEvent.ts";

/**
 * Update whenever the connection status of the websocket changes
 */
export default function useSocketConnection(): boolean {
    const defaultState = clientSocket.isConnected();
    const lastConnectionEvent = useEvent(clientSocket, "connection-changed", {
        isOpen: defaultState,
        isError: false
    });
    return lastConnectionEvent.isOpen;
}