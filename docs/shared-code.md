# Shared code
The setup of this project contains three main subdirectories:
- [client](../app/src/client)
- [server](../app/src/server)
- [shared](../app/src/shared)


The client and server should mostly be self-explanatory. While everything is served from the same server, the code of these two directories
is to be handled separately. That is required to separate public clientside code from the internal server code.
This is further supported by the ESLint check, which strictly prohibits importing from client into server and vice versa.

If there is any code that should be shared, this can be done in the shared directory.
The code from there can be imported from both the client and the server, but not the other way round.
In general, the shared code should be completely self-sustaining and of pure type.

Now what is intended to go into the shared directory?
- Types that are used by both sides and must keep equality between them
- Generic functions or classes, that have no direct association with either side