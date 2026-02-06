import Logger, {type LogLevel} from "@/shared/util/Logger.ts";

const logger = new Logger(Bun.env.LOG_LEVEL as LogLevel);
export default logger;