export type ClientToServerPackets = {
    "ping": { num: number },
    "login": { usernameOrEmail: string, password: string },
    "register": { email: string, username: string, password: string },
}

export type ClientToServerPacketName = keyof ClientToServerPackets;

export type ClientToServerPacketSignature<K extends ClientToServerPacketName> = {
    type: K;
    data: ClientToServerPackets[K];
}

export type ClientToServerPacket = ClientToServerPacketSignature<ClientToServerPacketName>;