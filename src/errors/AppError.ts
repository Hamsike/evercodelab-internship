import { BaseError } from './BaseError.js'

export class ValidationError extends BaseError {
  constructor(message: string, context?: unknown) {
    super(message, 400, context)
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string, context?: unknown) {
    super(`${resource} not found`, 404, context)
  }
}

export class ConflictError extends BaseError {
  constructor(resource: string, context?: unknown) {
    super(`${resource} already exists`, 409, context)
  }
}