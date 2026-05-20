import { startDemoTask, setupGracefulShutdown } from './controllers/taskController.js'
import { createLogger } from './utils/logger.js'
import { config } from './utils/config.js'

const logger = createLogger('Main')

function main() {
  logger.info(`=== ${config.appName} v${config.version} ===`, 'main')
  logger.info(`Environment: ${config.environment}`, 'main')
  logger.info(`Log level: ${config.logLevel}`, 'main')
  
  startDemoTask()
  setupGracefulShutdown()
  
  logger.info('Application ready, press Ctrl+C to stop', 'main')
}
main()