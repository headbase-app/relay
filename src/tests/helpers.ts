
export async function expectSocketsOpen(sockets: WebSocket[]) {
	const openPromises = sockets.map((socket) => new Promise<void>(resolve => {
		const onSetup = () => {
			socket.removeEventListener("open", onSetup);
			resolve();
		}
		socket.addEventListener("open", onSetup)
	}));

	await Promise.all(openPromises)
}

export async function expectSocketMessage(
	socket: WebSocket,
	test: (event: MessageEvent) => void,
	trigger: () => void,
) {
	return new Promise<void>((resolve) => {
		const onMessage = (event: MessageEvent) => {
			socket.removeEventListener("message", onMessage)
			test(event)
			resolve()
		}
		socket.addEventListener("message", onMessage)

		trigger()
	})
}

export async function expectNoSocketMessageForDuration(socket: WebSocket, duration: number) {
	return new Promise<void>((resolve, reject) => {
		const onMessage = () => {reject()}
		socket.addEventListener("message", onMessage)

		setTimeout(() => {
			socket.removeEventListener("message", onMessage)
			resolve()
		}, duration)
	})
}