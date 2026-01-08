import {createServer} from "../server";
import {describe, beforeEach, afterEach, test, expect} from "vitest";
import {expectNoSocketMessageForDuration, expectSocketMessage, expectSocketsOpen} from "./helpers";

describe('Relay Server', () => {
	const server = createServer();

	beforeEach(() => {
		server.listen(42100);
	});
	afterEach(() => {
		server.close();
	});

	test('Two sockets can connect and relay messages', async () => {
		const relayId = 'test-1'

		const socket1 = new WebSocket(`ws://localhost:42100/v1/${relayId}`)
		const socket2 = new WebSocket(`ws://localhost:42100/v1/${relayId}`)
		await expectSocketsOpen([socket1, socket2]);

		await expectSocketMessage(
			socket2,
			(event: MessageEvent) => {
				expect(event.data).toEqual("test")
			},
			() => {
				socket1.send("test")
			},
		)
	});

	test('Messages should not be relayed back to sender', async () => {
		const relayId = 'test-1'

		const socket1 = new WebSocket(`ws://localhost:42100/v1/${relayId}`)
		const socket2 = new WebSocket(`ws://localhost:42100/v1/${relayId}`)
		await expectSocketsOpen([socket1, socket2]);

		const expectNoSocket1Messages = expectNoSocketMessageForDuration(socket1, 1000)
		const expectSocket2Message = expectSocketMessage(
			socket2,
			(event: MessageEvent) => {
				expect(event.data).toEqual("test")
			},
			() => {
				socket1.send("test")
			},
		)

		await Promise.all([expectNoSocket1Messages, expectSocket2Message])
	});

	test('Messages should not leak between relays', async () => {
		const relayId1 = 'test-1'
		const relayId2 = 'test-2'

		const relay1socket1 = new WebSocket(`ws://localhost:42100/v1/${relayId1}`)
		const relay1socket2 = new WebSocket(`ws://localhost:42100/v1/${relayId1}`)
		const relay2socket1 = new WebSocket(`ws://localhost:42100/v1/${relayId2}`)
		const relay2socket2 = new WebSocket(`ws://localhost:42100/v1/${relayId2}`)
		await expectSocketsOpen([relay1socket1, relay1socket2, relay2socket1, relay2socket2]);

		const expectNoMessages1 = expectNoSocketMessageForDuration(relay2socket1, 1000)
		const expectNoMessages2 = expectNoSocketMessageForDuration(relay2socket1, 1000)

		const expectSocket1Message = expectSocketMessage(
			relay1socket1,
			(event: MessageEvent) => {
				expect(event.data).toEqual("test")
			},
			() => {
				relay1socket2.send("test")
			},
		)

		await Promise.all([
			expectNoMessages1,
			expectNoMessages2,
			expectSocket1Message,
		]);
	});
});
