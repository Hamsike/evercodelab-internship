import { startDemoTask, setupGracefulShutdown } from './controllers/taskController'
import { createLogger } from './utils/logger'
import { appConfig } from './utils/config'
import { startServer } from './server'

const logger = createLogger('Main')

function main() {
  logger.info(`=== ${appConfig.appName} v${appConfig.version} ===`, 'main')
  logger.info(`Environment: ${appConfig.environment}`, 'main')
  logger.info(`Log level: ${appConfig.logLevel}`, 'main')

  startServer()

  logger.info('Application ready, press Ctrl+C to stop', 'main')
}

main()