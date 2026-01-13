import {config} from "./config.js";
import { logger } from "./logger.js";
import {createServer} from "./server.js";

const server = createServer();
server.listen(config().port);
logger.info("server", `Server started at http://localhost:${config().port}`)
