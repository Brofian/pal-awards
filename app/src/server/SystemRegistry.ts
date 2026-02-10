import {pingPongHandler} from "@/server/system/PingPong.ts";
import logger from "@/server/util/Logger.ts";

/**
 * This is the list of all system handlers. They will be called once on system startup and can register
 * event listeners or do some other work.
 *
 * Other services like the database are NOT guaranteed to be available when the handlers are executed. These should
 * always be accessed via events.
 */
const systemHandlers: Function[] = [
    pingPongHandler,
    // Append your system handlers here
];

/**
 * Run the system handlers once per server startup
 */
let systemHandlersExecuted = false;
export default async function executeSystemHandlers() {
    if (!systemHandlersExecuted) {
        systemHandlersExecuted = true;

        logger.info("Executing system handlers")
        for (const sysHandler of systemHandlers) {
            await sysHandler();
        }
    }
}

