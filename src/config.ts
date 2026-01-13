import 'dotenv/config'

export interface Config {
	port: number
	allowedOrigins: string[]
	serverVersion: string
	adminSecret: string | null
	connectionCheckInterval: number
}

export function config(): Config {
	// todo: parse/validate variables before using
	const PORT = parseInt(process.env.PORT as string) || 8080
	const ADMIN_SECRET = process.env.ADMIN_SECRET || null
	const SERVER_VERSION = "v1.0"
	const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["*"]
	const CONNECTION_CHECK_INTERVAL = parseInt(process.env.CONNECTION_CHECK_INTERVAL as string) || 30000

	return {
		port: PORT,
		allowedOrigins: ALLOWED_ORIGINS,
		serverVersion: SERVER_VERSION,
		adminSecret: ADMIN_SECRET,
		connectionCheckInterval: CONNECTION_CHECK_INTERVAL
	}
}
