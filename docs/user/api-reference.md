# API Reference
The relay server allows peers to connect together and exchange messages. It does not persist data, just relays messages between connected peers.  

Peers connect by supplying a "relay id" when connecting to the server and can then only send and recieve messages to other peers who have connected with the same "relay id".

## Authentication & Authorization

### Admin Token
If you do not wish the relay to be publically usable, you can set a static `ADMIN_SECRET` environment variable which must then be passed in the `Sec-WebSocket-Protocol` header when making a websocket connection, for example `Sec-WebSocket-Protocol: <admin-secret>`.  
Here is an example of this in JavaScript:  

```js
const ws = new WebSocket("ws://localhost:42102/v1?relay_id=relay-1&peer_id=peer-1", ["<admin-secret>"])
```

During the upgrade to websockets the server will:
- Validate the admin token
- If configured, check that the `Origin` header of your request matches an allowed origin as set in the `ALLOWED_ORIGINS` environment variable.

### Relay authorization
Once authenticated via the admin secret, the server currently does not perform any authorization checks for connecting to a given relay id.  

In future the plan is to use public/private key encyrption to secure relays, where the public key would be used as the "relay id" and peers would have to authenticate with the server
via a key exchange mechanism. This would likely mean peers obtaining a connection ticket via HTTP, before supplying the ticket to `Sec-WebSocket-Protocol` to open a connection.
