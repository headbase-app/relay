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
	- Sent to discover other connected devices.
	- Devices should respond directly via "ack" events.
- `announce`
	- Sent to announce presence to other connected devices.
