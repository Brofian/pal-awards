export type ServerToClientPackets = {
    "pong": { num: 24 }
}

export type ServerToClientEventName = keyof ServerToClientPackets;

export type ServerToClientPacketSignature<K extends keyof ServerToClientPackets> = {
    type: K;
    data: ServerToClientPackets[K];
}

export type ServerToClientPacket = ServerToClientPacketSignature<ServerToClientEventName>;