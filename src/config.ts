// todo: parse/validate variables before using
export const PORT = process.env.PORT || 3000
const SERVER_VERSION = "v1.0"
const ADMIN_SECRET = process.env.ADMIN_SECRET || null
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["*"]

export function config() {
	return {
		port: PORT,
		allowedOrigins: ALLOWED_ORIGINS,
		serverVersion: SERVER_VERSION,
		adminSecret: ADMIN_SECRET,
	}
}
