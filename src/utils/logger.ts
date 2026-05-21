import { appConfig } from './config.js'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace'

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
}

const currentLevel = LOG_LEVELS[appConfig.logLevel as LogLevel] ?? LOG_LEVELS.info

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= currentLevel
}

function formatMessage(level: LogLevel, message: string, requestId?: string): string {
  const timestamp = new Date().toISOString()
  const rid = requestId ? ` [${requestId}]` : ''
  return `[${timestamp}]${rid} [${appConfig.appName}] [${level.toUpperCase()}]: ${message}`
}

export interface Logger {
  error: (msg: string, requestId?: string) => void
  warn: (msg: string, requestId?: string) => void
  info: (msg: string, requestId?: string) => void
  debug: (msg: string, requestId?: string) => void
  trace: (msg: string, requestId?: string) => void
  logError: (err: Error | string, context?: string, requestId?: string) => void
  child: (prefix: string) => Logger
}

export function createLogger(prefix?: string): Logger {
  const log = (level: LogLevel, msg: string, requestId?: string) => {
    if (!shouldLog(level)) return

    const formatted = formatMessage(level, prefix ? `[${prefix}] ${msg}` : msg, requestId)

    switch (level) {
      case 'error': console.error(formatted); break
      case 'warn': console.warn(formatted); break
      case 'info': console.info(formatted); break
      case 'debug': console.debug(formatted); break
      case 'trace': console.trace(formatted); break
    }
  }

  return {
    error: (msg, requestId) => log('error', msg, requestId),
    warn: (msg, requestId) => log('warn', msg, requestId),
    info: (msg, requestId) => log('info', msg, requestId),
    debug: (msg, requestId) => log('debug', msg, requestId),
    trace: (msg, requestId) => log('trace', msg, requestId),

    logError: (err, context, requestId) => {
      const msg = err instanceof Error
        ? `${context ? context + ' - ' : ''}${err.message}\nStack: ${err.stack}`
        : String(err)
      log('error', msg, requestId)
    },

    child: (prefixName) => createLogger(prefix ? `${prefix}.${prefixName}` : prefixName)
  }
}
