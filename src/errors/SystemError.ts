import { BaseError } from './BaseError.js'

export class SystemError extends BaseError {
  public readonly code: string
  public readonly syscall?: string
  public readonly path?: string

  constructor(code: string, message: string, syscall?: string, path?: string) {
    super(`[${code}] ${message}`, { syscall, path })
    this.code = code
    this.syscall = syscall
    this.path = path
  }
}

export class ENOENTError extends SystemError {
  constructor(path?: string) {
    super('ENOENT', 'File or directory not found', 'open', path)
  }
}

export class EACCESError extends SystemError {
  constructor(path?: string) {
    super('EACCES', 'Permission denied', 'open', path)
  }
}
