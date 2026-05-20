import { BaseError } from './BaseError.js'


export class ValidationError extends BaseError {
  constructor(message: string, context?: unknown) {
    super(message, context, 400)
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string, context?: unknown) {
    super(`${resource} not found`, context, 404)
  }
}

export class ConflictError extends BaseError {
  constructor(resource: string, context?: unknown) {
    super(`${resource} already exists`,context, 409)
  }
}