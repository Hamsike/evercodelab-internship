import { createLogger } from '../src/utils/logger'

describe('Logger', () => {
  let logOutput = ''

  beforeEach(() => {
    logOutput = ''
    console.log = jest.fn((msg) => { logOutput = msg })
    console.info = jest.fn((msg) => { logOutput = msg })
    console.error = jest.fn((msg) => { logOutput = msg })
    console.warn = jest.fn((msg) => { logOutput = msg })
    console.debug = jest.fn((msg) => { logOutput = msg })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createLogger', () => {
    it('should create logger with all methods', () => {
      const logger = createLogger()
      expect(logger).toHaveProperty('info')
      expect(logger).toHaveProperty('error')
      expect(logger).toHaveProperty('warn')
      expect(logger).toHaveProperty('debug')
      expect(logger).toHaveProperty('trace')
      expect(logger).toHaveProperty('child')
      expect(logger).toHaveProperty('logError')
    })

    it('should create logger with context prefix', () => {
      const logger = createLogger('TestContext')
      logger.info('Hello world')
      expect(logOutput).toContain('TestContext')
      expect(logOutput).toContain('Hello world')
    })
  })

  describe('log levels', () => {
    it('should log info messages', () => {
      const logger = createLogger()
      logger.info('Info message')
      expect(logOutput).toContain('[INFO]')
      expect(logOutput).toContain('Info message')
    })

    it('should log error messages', () => {
      const logger = createLogger()
      logger.error('Error message')
      expect(logOutput).toContain('[ERROR]')
      expect(logOutput).toContain('Error message')
    })

    it('should log warn messages', () => {
      const logger = createLogger()
      logger.warn('Warn message')
      expect(logOutput).toContain('[WARN]')
      expect(logOutput).toContain('Warn message')
    })
  })

  describe('requestId', () => {
    it('should include requestId when provided', () => {
      const logger = createLogger()
      logger.info('Test message', 'req-123')
      expect(logOutput).toContain('[req-123]')
      expect(logOutput).toContain('Test message')
    })

    it('should work without requestId', () => {
      const logger = createLogger()
      logger.info('Test message')
      expect(logOutput).not.toContain('[undefined]')
      expect(logOutput).toContain('Test message')
    })
  })

  describe('child logger', () => {
    it('should create child logger with extended prefix', () => {
      const parent = createLogger('Parent')
      const child = parent.child('Child')
      child.info('Message from child')
      expect(logOutput).toContain('[Parent.Child]')
      expect(logOutput).toContain('Message from child')
    })

    it('should create nested child loggers', () => {
      const parent = createLogger('Parent')
      const child = parent.child('Child')
      const grandChild = child.child('GrandChild')
      grandChild.info('Deep message')
      expect(logOutput).toContain('[Parent.Child.GrandChild]')
      expect(logOutput).toContain('Deep message')
    })
  })

  describe('logError', () => {
    it('should log Error object with stack trace', () => {
      const logger = createLogger()
      const error = new Error('Test error')
      logger.logError(error, 'context info')
      expect(logOutput).toContain('[ERROR]')
      expect(logOutput).toContain('Test error')
      expect(logOutput).toContain('Stack:')
    })

    it('should log string error', () => {
      const logger = createLogger()
      logger.logError('String error message')
      expect(logOutput).toContain('String error message')
    })

    it('should work with requestId', () => {
      const logger = createLogger()
      const error = new Error('Test error')
      logger.logError(error, 'context', 'req-456')
      expect(logOutput).toContain('[req-456]')
      expect(logOutput).toContain('Test error')
    })
  })
})
