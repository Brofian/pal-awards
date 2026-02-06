# Socket module

This module provides unified type safety and IDE support across a websocket connection.
All data has to be formatted to fit into one of the Packet declarations.

Each packet can then be assigned to be a [ClientToServerPacket](packets/ClientToServerPackets.ts) or
a [ServerToClientPacket](packets/ServerToClientPackets.ts).
Theoretically even both, if it makes sense to send the data in both directions.
They are then combined under the type of `Packet`.

This allows the client code to only send data of a ClientToServerPacket and vice versa. Under the circumstances of a
normal user,
this ensures correct data handling and prevents arbitrary assumptions over the datatype.
It does fail if the client and server communications somehow gets out of sync. But as both reference
these packets and are served from the same server, this should not occur in the expected scenarios.