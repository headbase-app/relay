import { createServer as createHttpServer } from 'http';
import express from "express";
import {config} from "./config";
import {RelayServer} from "./relay";

export function createServer() {
	const app = express()
	const server = createHttpServer(app);

	app.get('/', (req, res) => {
		res.send({
			version: config().serverVersion,
			isPublic: config().adminSecret === null,
		})
	})

	new RelayServer(server)

	return server
}
