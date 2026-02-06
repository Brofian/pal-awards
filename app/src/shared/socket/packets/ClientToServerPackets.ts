export type ClientToServerPackets = {
    "ping": { num: 42 }
}

export type ClientToServerEventName = keyof ClientToServerPackets;

export type ClientToServerPacketSignature<K extends ClientToServerEventName> = {
    type: K;
    data: ClientToServerPackets[K];
}

export type ClientToServerPacket = ClientToServerPacketSignature<ClientToServerEventName>;