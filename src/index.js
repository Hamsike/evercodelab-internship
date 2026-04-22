const {createLogger} = require('./logger.js')
const config = require('./config.js')

const logger = createLogger()

logger.info('=== Application Started ===');
logger.info('App: ' + config.appName);
logger.info('Version: ' + config.version);
logger.info('Environment: ' + config.environment);
