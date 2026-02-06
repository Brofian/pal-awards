import type {ClientToServerPacket} from "@/shared/socket/packets/ClientToServerPackets.ts";
import type {ServerToClientPacket} from "@/shared/socket/packets/ServerToClientPackets.ts";


export type Packet = ServerToClientPacket | ClientToServerPacket;

