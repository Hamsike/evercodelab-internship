import { BaseError } from '../errors/BaseError.js'
import { scheduleTask, stopAllTasks, stopTask } from '../services/taskService.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger('TaskController')

export function startDemoTask() {
  try {
    scheduleTask('running-logger', 10000, () => {
      console.log('running')
    })
    logger.info('Demo task started', 'startDemoTask')
  } catch (err) {
    if (err instanceof BaseError) {
      logger.error(`[${err.statusCode}] ${err.name}: ${err.message}`, 'startDemoTask')
      if (err.context) {
        logger.debug(`Context: ${JSON.stringify(err.context)}`, 'startDemoTask')
      }
    } else {
      logger.error('Failed to start demo task', 'startDemoTask')
    }
  }
}

export function stopTaskByName(name: string) {
  try {
    stopTask(name)
    logger.info(`Task "${name}" stopped`, 'stopTaskByName')
  } catch (err) {
    if (err instanceof BaseError) {
      logger.error(`Failed to stop task: ${err.message}`, 'stopTaskByName')
    }
  }
}

export function setupGracefulShutdown() {
  process.on('SIGINT', () => {
    logger.info('\nShutting down...', 'gracefulShutdown')
    const count = stopAllTasks()
    logger.info(`Stopped ${count} tasks, graceful shutdown complete`, 'gracefulShutdown')
    process.exit(0)
  })
}
