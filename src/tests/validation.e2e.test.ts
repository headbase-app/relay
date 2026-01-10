import {createServer} from "../server";
import {describe, test} from "vitest";
import {
	expectSocketsError, expectSocketsOpen,
} from "./helpers/helpers";

describe('Validation checks', () => {
	test('Given no relay id supplied, the socket should be closed', async () => {
		const ADMIN_SECRET = "testing"
		const server = createServer({adminSecret: ADMIN_SECRET});
		server.listen(42100)

		const socket1 = new WebSocket(`ws://localhost:42100/v1?peerId=peer-1`, [ADMIN_SECRET])
		await expectSocketsError([socket1]);

		server.close();
	});

	test('Given no peer id supplied, the socket should be closed', async () => {
		const ADMIN_SECRET = "testing"
		const server = createServer({adminSecret: ADMIN_SECRET});
		server.listen(42100)

		const socket1 = new WebSocket(`ws://localhost:42100/v1?relayId=relay-1`, [ADMIN_SECRET])
		await expectSocketsError([socket1]);

		server.close();
	});

	test('Given upgrading connection on invalid url, the socket should be closed', async () => {
		const ADMIN_SECRET = "testing"
		const server = createServer({adminSecret: ADMIN_SECRET});
		server.listen(42100)

		const socket1 = new WebSocket(`ws://localhost:42100/invalid?peerId=peer-1&relayId=relay-1`, [ADMIN_SECRET])
		await expectSocketsError([socket1]);

		server.close();
	});

	test('Given trailing slash in URL, the socket should still be opened', async () => {
		const ADMIN_SECRET = "testing"
		const server = createServer({adminSecret: ADMIN_SECRET});
		server.listen(42100)

		const socket1 = new WebSocket(`ws://localhost:42100/v1/?peerId=peer-1&relayId=relay-1`, [ADMIN_SECRET])
		await expectSocketsOpen([socket1]);

		server.close();
	});
});
