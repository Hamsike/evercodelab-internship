import { createLogger } from './logger.js';
import { config } from './config.js';

const logger = createLogger()

logger.info('=== Application Started ===');
logger.info('App: ' + config.appName);
logger.info('Version: ' + config.version);
logger.info('Environment: ' + config.environment);
