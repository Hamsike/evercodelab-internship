import { startDemoTask, setupGracefulShutdown } from './controllers/taskController.js'
import { createLogger } from './utils/logger.js'
import { config } from './utils/config.js'

const logger = createLogger()

function main() {
  logger.info(`Starting ${config.appName} v${config.version}`)

  startDemoTask()
  setupGracefulShutdown()

  logger.info('Application ready, press Ctrl+C to stop')
}

main()