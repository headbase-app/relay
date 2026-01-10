import {createServer} from "../src/server";
import {describe, test} from "vitest";
import {
	expectSocketsError,
	expectSocketsOpen
} from "./helpers/helpers";

describe('Authentication checks', () => {
	test('Given valid admin token, socket should be upgraded successfully', async () => {
		const ADMIN_SECRET = "testing"
		const server = createServer({adminSecret: ADMIN_SECRET});
		server.listen(42100)

		const socket1 = new WebSocket(`ws://localhost:42100/v1?peerId=peer-1&relayId=relay-1`, [ADMIN_SECRET])
		await expectSocketsOpen([socket1]);

		server.close();
	});

	test('Given invalid admin token, socket should be closed', async () => {
		const ADMIN_SECRET = "testing"
		const server = createServer({adminSecret: ADMIN_SECRET});
		server.listen(42100)

		const socket1 = new WebSocket(`ws://localhost:42100/v1?peerId=peer-1&relayId=relay-1`, ["invalid"])
		await expectSocketsError([socket1]);

		server.close();
	});

	test('Given no admin token, socket should be closed', async () => {
		const ADMIN_SECRET = "testing"
		const server = createServer({adminSecret: ADMIN_SECRET});
		server.listen(42100)

		const socket1 = new WebSocket(`ws://localhost:42100/v1?peerId=peer-1&relayId=relay-1`)
		await expectSocketsError([socket1]);

		server.close();
	});
});
