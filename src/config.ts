import 'dotenv/config'

export interface Config {
	port: number
	allowedOrigins: string[]
	serverVersion: string
	adminSecret: string | null
}

export function config(): Config {
	// todo: parse/validate variables before using
	const PORT = parseInt(process.env.PORT as string) || 3000
	const ADMIN_SECRET = process.env.ADMIN_SECRET || null
	const SERVER_VERSION = "v1.0"
	const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["*"]

	return {
		port: PORT,
		allowedOrigins: ALLOWED_ORIGINS,
		serverVersion: SERVER_VERSION,
		adminSecret: ADMIN_SECRET,
	}
}
