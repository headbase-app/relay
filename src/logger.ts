export interface LogInput {
    level: "error" | "warn" | "info" | "debug",
    message: string
    context?: any
    label: string
}

export interface LogOutput extends LogInput {
    timestamp: string
}

export type LogMethod = (item: LogOutput) => void | Promise<void>

export interface ILogger {
    error: (label: string, message: string, context?: any) => void,
    warn: (label: string, message: string, context?: any) => void,
    info: (label: string, message: string, context?: any) => void,
    debug: (label: string, message: string, context?: any) => void,
}

export class Logger implements ILogger {
    #logMethod: LogMethod

    constructor(logMethod: LogMethod) {
        this.#logMethod = logMethod
    }

    #log(item: LogInput) {
        const output: LogOutput = {
            ...item,
            timestamp: new Date().toISOString()
        }
        this.#logMethod(output)
    }

    warn(label: string, message: string, context?: any) {
        this.#log({
            level: "warn",
            label,
            message,
            ...(context ? {context} : {})
        })
    }

    error(label: string, message: string, context?: any) {
        this.#log({
            level: "error",
            label,
            message,
            ...(context ? {context} : {})
        })
    }

    info(label: string, message: string, context?: any) {
        this.#log({
            level: "info",
            label,
            message,
            ...(context ? {context} : {})
        })
    }

    debug(label: string, message: string, context?: any) {
        this.#log({
            level: "debug",
            label,
            message,
            ...(context ? {context} : {})
        })
    }
}

export const logger = new Logger(console.log)
