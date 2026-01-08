import { createServer } from 'http';
import express from "express";
import {config} from "./config";
import {RelayServer} from "./server";

const app = express()
const server = createServer(app);

app.get('/', (req, res) => {
	res.send({
		version: config().serverVersion,
		isPublic: config().adminSecret === null,
	})
})

new RelayServer(server)
server.listen(config().port)
console.log(`Relay Server started. Listening on http://localhost:${config().port}`)
