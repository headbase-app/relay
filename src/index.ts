import {config} from "./config.js";
import {createServer} from "./server.js";

const server = createServer();
server.listen(config().port)
console.log(`[start] Relay server started at http://localhost:${config().port}`)
