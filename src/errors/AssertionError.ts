import { BaseError } from './BaseError.js'

export class AssertionError extends BaseError {
  public readonly expected?: unknown
  public readonly actual?: unknown

  constructor(message: string, expected?: unknown, actual?: unknown) {
    super(message, { expected, actual })
    this.expected = expected
    this.actual = actual
  }
}