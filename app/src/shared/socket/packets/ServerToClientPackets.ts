import type {TranslationKey} from "@/shared/translation/Translation.ts";

export type ServerToClientPackets = {
    "pong": { num: number },
    "authenticationChanged": {
        authenticated: false,
    } | {
        authenticated: true,
        verified: boolean,
        username: string,
        authToken: string,
        authTokenTTL?: number,
    },
    "loginResponse": {
        success: true,
    } | {
        success: false,
        error: TranslationKey
    },
    "registrationResponse": {
        success: true,
    } | {
        success: false,
        error: TranslationKey,
    }
}

export type ServerToClientPacketName = keyof ServerToClientPackets;

export type ServerToClientPacketSignature<K extends keyof ServerToClientPackets> = {
    type: K;
    data: ServerToClientPackets[K];
}

export type ServerToClientPacket = ServerToClientPacketSignature<ServerToClientPacketName>;