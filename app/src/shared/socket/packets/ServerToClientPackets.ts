export type ServerToClientPackets = {
    "pong": { num: number }
}

export type ServerToClientPacketName = keyof ServerToClientPackets;

export type ServerToClientPacketSignature<K extends keyof ServerToClientPackets> = {
    type: K;
    data: ServerToClientPackets[K];
}

export type ServerToClientPacket = ServerToClientPacketSignature<ServerToClientPacketName>;