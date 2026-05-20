import { BaseError } from '../errors/index.js'
import { scheduleTask, stopAllTasks, stopTask } from '../services/taskService.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger()

export function startDemoTask() {
  try {
    scheduleTask('running-logger', 10000, () => {
      console.log('running')
    })
    logger.info('Demo task started')
  }
  catch (err) {
    if (err instanceof BaseError) {
      logger.error(`[${err.statusCode}] ${err.name}: ${err.message}`)
      if (err.context) {
        logger.debug(`Context: ${JSON.stringify(err.context)}`)
      }
    }
    else {
      logger.error('Failed to start demo task')
    }
  }
}

export function stopTaskByName(name: string) {
  try {
    stopTask(name)
  }
  catch (err) {
    if (err instanceof BaseError) {
      logger.error(`Failed to stop task: ${err.message}`)
    }
  }
}

export function setupGracefulShutdown() {
  process.on('SIGINT', () => {
    logger.info('\nShutting down...')
    stopAllTasks()
    logger.info('Graceful shutdown complete')
    process.exit(0)
  })
}