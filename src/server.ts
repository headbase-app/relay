import { createServer as createHttpServer } from 'http';
import express from "express";

import {config, Config} from "./config.js";
import {RelayServer} from "./relay.js";


export function createServer(configOverride?: Partial<Config>) {
	const serverConfig = {
		...config(),
		...(configOverride ? configOverride : {})
	}

	const app = express()
	const server = createHttpServer(app);

	app.get('/', (req, res) => {
		res.send({
			message: "Hello from a Headbase Relay Server! Learn more at https://github.com/headbase-app/relay.",
		})
	})

	app.get('/v1', (req, res) => {
		res.send({
			version: serverConfig.serverVersion,
			isPublic: serverConfig.adminSecret === null,
		})
	})

	new RelayServer(server, serverConfig)

	return server
}
