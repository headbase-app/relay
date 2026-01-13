# API Reference
The relay server allows peers to connect together and exchange messages. It does not persist data, just relays messages between connected peers.  

Peers connect by supplying a "relay id" when connecting to the server and can then only send and receive messages to other peers who have connected with the same "relay id".

## Connecting

### Admin Token
If you do not wish the relay to be publicly usable, you can set a static `ADMIN_SECRET` environment variable which must then be passed in the `Sec-WebSocket-Protocol` header when making a websocket connection, for example `Sec-WebSocket-Protocol: <admin-secret>`.  
Here is an example of this in JavaScript:  

```js
const ws = new WebSocket("wss://localhost:42102/v1?relayId=relay-1&peerId=peer-1", ["<admin-secret>"])
```

During the upgrade to websockets the server will:
- Validate the admin token
- If configured, check that the `Origin` header of your request matches an allowed origin as set in the `ALLOWED_ORIGINS` environment variable.

### Relay Authorization
Once authenticated via the admin secret, the server currently does not perform any authorization checks for connecting to a given relay.  

In future the plan is to use public/private key encryption to secure relays, where the public key would be used as the "relay id" and peers would have to authenticate with the server
via a key exchange mechanism. This would likely mean peers obtaining a connection ticket via HTTP, before supplying the ticket to `Sec-WebSocket-Protocol` to open a connection.

### Connection Health Checks (ping/pong)
In order to monitor connection health the server will send periodic `ping` messages. When receiving these, the connected peer should respond by sending a `pong` message.  
If the server determines that a connection is stale (no pong replies or other messages for a given duration) it will close the connection.  

Peers should also implement the same logic to monitor connection health with the server. When the server receives a `ping` message, it will respond by sending a `pong` message.  
If a peer determines that the connection is stale (no pong replies or other message for a given duration) it should close the connection and attempt to reconnect.

Note that the server will never relay `ping`/`pong` messages between peers, these are unique to each connection.

## Sending messages

### Relaying
When a peer sends a message, the server will relay that message to all other peers connected to that relay (same relayId).

### Sending to specific peer
Peers may direct a message directly to another peer by sending a JSON payload with the `targetPeerId` key, for example:

```ts
ws.send(JSON.stringify({targetPeerId: "<peer id>"}))
```
Note that the server provides no built in way to discover connected peers and their identifiers so this requires
either already knowing the peer id or some common discovery mechanism implemented/shared by all connected peers.

In future the server may offer more sophisticated capabilities such as automatically sending peer details, validating `targetPeerId` etc.

### Errors and Acknowledgements
The server does not send error responses or acknowledgements.
This includes situations like providing an invalid `targetPeerId`, if there are no other connected peers, if a given message was received/relayed etc.  

In future the server may offer more sophisticated capabilities, however for now such a system would have to be implemented/shared by all connected peers.
