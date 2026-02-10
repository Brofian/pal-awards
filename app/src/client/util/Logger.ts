import AbstractLogger from "@/shared/util/Logger.ts";

// as the bundler separates frontend and backend code, but bun does not provide a native way of passing certain
// environment variables to the frontend, we SADLY have to hardcode this for now. Change once a solution is available

const logger = new AbstractLogger("DEBUG");
export default logger;