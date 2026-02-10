export type ClientToServerPackets = {
    "ping": { num: number }
}

export type ClientToServerPacketName = keyof ClientToServerPackets;

export type ClientToServerPacketSignature<K extends ClientToServerPacketName> = {
    type: K;
    data: ClientToServerPackets[K];
}

export type ClientToServerPacket = ClientToServerPacketSignature<ClientToServerPacketName>;