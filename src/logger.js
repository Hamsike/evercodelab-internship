const config = require('./config.js')

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return '[' + timestamp + '] [' + config.appName + '] [' + level.toUpperCase() + ']: ' + message;
}

function createLogger() {
  return {
    info: (msg) => console.log(formatMessage('info', msg)),
    warn: (msg) => console.warn(formatMessage('warn', msg)),
    error: (msg) => console.error(formatMessage('error', msg)),
    debug: (msg) => {
      if (config.logLevel === 'debug') {
        console.debug(formatMessage('debug', msg));
      }
    }
  };
}

module.exports = { createLogger }