# API Reference
The relay server allows peers to connect together and exchange messages. It does not persist data, just relay message to clients which can.

## Authentication

### Admin Token
The admin token should be passed in the `Sec-WebSocket-Protocol` header when making a websocket connection, for example `Sec-WebSocket-Protocol: <admin-secret>`.
Here is an example of this in JavaScript:

```js
const ws = new WebSocket("ws://localhost:42102/v1/:relayId", ["<admin-secret>"])
```

During the upgrade to websockets the server will:
- Validate the admin token
- If configured, check that the `Origin` header of your request matches an allowed origin

## Messages
- `discover`
	- Sent to discover other connected peers.
	- Peers must reply with `announce` message
- `announce`
	- Sent to announce peer details to other connected peer: `peerId, isProvider,
	- Must be sent when connecting or reconnecting
		- Must be sent after receiving a `discover` message
- `sync`
	- Sent to request snapshot data from all connected peers
	- Peers should reply with a `snapshot` message if able, but may choose not to for reasons such as performance or if that peer is busy with its own sync
		- The sending peer should expect `snapshot` replies may be delayed by a few seconds and handle accordingly
- `snapshot`
	- Sent in response to a `sync` message, contains id and deletion state of all objects the peer knows about
- `get`
	- Sent to request a specific object
	- If another connected peer has announced itself as a "provider", the sending client should first attempt to send the message directly to that peer
		- If multiple connected peers have announced themselves as "providers", the sending client should use the peer "priority" data if present to pick the peer
		- If the target peer does not respond directly, the sending peer may then choose to send the message globally
- `create`
	- Sent by a peer when an object is created
- `delete`
	- Sent by a peer when an object is deleted 
