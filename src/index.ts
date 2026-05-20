import { startDemoTask, setupGracefulShutdown } from './controllers/taskController'
import { createLogger } from './utils/logger'
import { appConfig } from './utils/config'

const logger = createLogger('Main')

function main() {
  logger.info(`=== ${appConfig.appName} v${appConfig.version} ===`, 'main')
  logger.info(`Environment: ${appConfig.environment}`, 'main')
  logger.info(`Log level: ${appConfig.logLevel}`, 'main')

  startDemoTask()
  setupGracefulShutdown()

  logger.info('Application ready, press Ctrl+C to stop', 'main')
}

main()