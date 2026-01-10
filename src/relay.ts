import { IncomingMessage, Server } from "node:http";
import {WebSocketServer, WebSocket, RawData} from "ws"
import {Duplex} from "node:stream";

import {Config} from "./config.js";


export interface RelayWebSocket extends WebSocket {
	// A unique peer identifier passed to the server on connection, used for directing messages.
	peerId: string
	// The relay identifier supplied by the connecting socket used for relaying messages between sockets with the same relay id.
	relayId: string
}

export class RelayServer {
	#config: Config
	server: Server;
	#wss: WebSocketServer

	constructor(server: Server, config: Config) {
		this.#config = config
		this.server = server;
		this.#wss = new WebSocketServer({ noServer: true });
		server.on("upgrade", this.handleServerUpgrade.bind(this));
		this.#wss.on("connection", this.handleConnection.bind(this));
	}

	async handleServerUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
		// todo: validate that the request is a given path?
		if (!this.#config.allowedOrigins.includes("*")) {
			if (!req.headers.origin || !this.#config.allowedOrigins.includes(req.headers.origin)) {
				// todo: send error response of some kind?
				socket.destroy();
				return;
			}
		}

		if (this.#config.adminSecret) {
			const adminToken = req.headers["sec-websocket-protocol"];
			if (typeof adminToken !== "string" || adminToken !== this.#config.adminSecret) {
				// todo: send error response of some kind?
				socket.destroy();
				return;
			}
		}

		const url = new URL(`http://localhost:0${req.url}`);
		if (!(url.pathname === "/v1" || url.pathname === "/v1/")) {
			// todo: send error response of some kind?
			socket.destroy()
			return;
		}

		const relayId = url.searchParams.get("relayId");
		const peerId = url.searchParams.get("peerId");
		if (!relayId || !peerId) {
			// todo: send error response of some kind?
			socket.destroy()
			return;
		}

		// @ts-ignore --- Using custom type which expands WebSocket type with metadata
		this.#wss.handleUpgrade(req, socket, head, async (socket: RelayWebSocket) => {
			socket.peerId = peerId;
			socket.relayId = relayId;
			this.#wss.emit("connection", socket, req);
		})
	}

	handleConnection(ws: RelayWebSocket) {
		// todo: is this needed?
		ws.on("error", console.error);

		ws.on("message", async (data, isBinary) => {
			// todo: validate to a set of expected messages?
			// todo: apply rate limiting/abuse protection for clients?
			this.handleMessage(ws, data, isBinary)
		});
	}

	handleMessage(sourceSocket: RelayWebSocket, data: RawData, isBinary?: boolean) {
		const message = isBinary ? data : data.toString();

		let targetPeerId: string | null = null;
		if (typeof message === "string") {
			try {
				const parsed = JSON.parse(message);
				if (parsed.targetPeerId) {
					targetPeerId = parsed.targetPeerId ? parsed.targetPeerId : null;
				}
			}
			catch (error) {
				targetPeerId = null;
			}
		}

		if (targetPeerId) {
			// todo: this forEach might scale badly with lots of connected sockets?
			// If so, sockets could be stored in a {relayId: socket[]} map to avoid looping over all clients.
			this.#wss.clients.forEach((client) => {
				if ((client as RelayWebSocket).peerId === targetPeerId) {
					client.send(data, {binary: isBinary})
				}
			})
		}
		else {
			// todo: this forEach might scale badly with lots of connected sockets?
			// If so, sockets could be stored in a {relayId: socket[]} map to avoid looping over all clients.
			this.#wss.clients.forEach((client) => {
				if (client !== sourceSocket && (client as RelayWebSocket).relayId === sourceSocket.relayId && client.readyState === WebSocket.OPEN) {
					client.send(data, {binary: isBinary})
				}
			})
		}
	}
}
