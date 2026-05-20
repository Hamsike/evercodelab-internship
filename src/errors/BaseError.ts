export class BaseError extends Error {
  public readonly timestamp: string
  public readonly context?: unknown
  public readonly statusCode: number

  constructor(message: string, context?: unknown, statusCode: number = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.timestamp = new Date().toISOString()
    this.context = context
    Error.captureStackTrace(this, this.constructor)
  }
}