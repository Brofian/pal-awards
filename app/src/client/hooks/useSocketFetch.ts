import {useEffect, useState} from "react";
import type {CustomEventInit} from "bun";
import type {ClientToServerPacketName, ClientToServerPackets} from "@/shared/socket/packets/ClientToServerPackets.ts";
import type {ServerToClientPacketName, ServerToClientPackets} from "@/shared/socket/packets/ServerToClientPackets.ts";
import clientSocket, {packetNameToReceivedEvent} from "@/client/util/ClientSocket.ts";
import useSocketConnection from "@/client/hooks/useSocketConnection.ts";
import type {SimpleEventListener} from "@/shared/events/SimpleEventTarget.ts";

/**
 * A function for validating a response before updating the last received value of the useSocketFetch hook
 *
 * @param request        The data that was sent along with the request.
 * @param response       The newly received response data.
 * @param responseIndex  The indexed number of how often the response package was already checked.
 *                       Is reset to zero whenever the hook-parameters change.
 */
type MatchingFunction<
    REQ extends ClientToServerPacketName,
    RES extends ServerToClientPacketName,
> = {
    (
        request: ClientToServerPackets[REQ],
        response: undefined | ServerToClientPackets[RES],
        responseIndex: number
    ): boolean
};


export default function useSocketFetch<
    REQ extends ClientToServerPacketName,
    RES extends ServerToClientPacketName,
>(  // Overloaded method that adds the undefined return type if a default is omitted. This comment cannot be a JSDoc
    requestPacket: REQ,
    requestData: ClientToServerPackets[REQ],
    responsePacket: RES,
): ServerToClientPackets[RES] | undefined;


export default function useSocketFetch<
    REQ extends ClientToServerPacketName,
    RES extends ServerToClientPacketName,
>(  // Overloaded method that removes the undefined return type if a default is given. This comment cannot be a JSDoc
    requestPacket: REQ,
    requestData: ClientToServerPackets[REQ],
    responsePacket: RES,
    defaultValue: ServerToClientPackets[RES],
    matchingFunction?: MatchingFunction<REQ, RES>,
): ServerToClientPackets[RES];


/**
 * Fetch data via the websocket by supplying a request packet name with data and the expected response packet name.
 * This hook either returns undefined or the last received response packet data.
 *
 * Additionally, you can define a matchingFunction, that is executed on every response event call. This allows
 * you to compare the request and response data and compare them. The event is then only used if the matchingFunction
 * returns true and ignored otherwise.
 *
 * @param requestPacket     The packet name to send for fetching data.
 * @param requestData       The data that is sent alongside the request packet to the server.
 * @param responsePacket    The packet name that is expected as a response from the server.
 * @param defaultValue      A default value until the first response is received.
 * @param matchingFunction  A function to validate response data before reacting.
 */
export default function useSocketFetch<
    REQ extends ClientToServerPacketName,
    RES extends ServerToClientPacketName,
>(
    requestPacket: REQ,
    requestData: ClientToServerPackets[REQ],
    responsePacket: RES,
    defaultValue?: ServerToClientPackets[RES],
    matchingFunction?: MatchingFunction<REQ, RES>
): ServerToClientPackets[RES] | undefined {
    const isConnected = useSocketConnection();
    const [value, setValue] = useState<ServerToClientPackets[RES] | undefined>(defaultValue);

    /*
     * Set up the effect handler for receiving the response data.
     */
    useEffect(() => {
        let responseIndex = 0;

        const event = packetNameToReceivedEvent(responsePacket);

        const handler = ((evt: CustomEventInit<ServerToClientPackets[RES]>): void => {
            const responseData = evt.detail;

            // only update the value if the matching function approves the new data
            if (!matchingFunction || matchingFunction(requestData, responseData, responseIndex)) {
                setValue(responseData);
            }
            responseIndex++;
        }) as SimpleEventListener<ServerToClientPackets[ServerToClientPacketName]>;

        // subscribe to the response event
        clientSocket.on(event, handler);

        return () => {
            // unsubscribe from the response event on cleanup
            clientSocket.off(event, handler);
        };
    }, [isConnected, requestPacket, requestData, responsePacket, value]);

    /*
     * Send the request event once per request definition.
     * Only send again when reconnecting or if the request target or data updates.
     */
    useEffect(() => {
        if (isConnected) {
            clientSocket.sendPacket(requestPacket, requestData);
        }
    }, [isConnected, requestPacket, JSON.stringify(requestData)]);

    return value;
}