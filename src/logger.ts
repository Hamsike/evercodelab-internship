import { config } from "./config";

function formatMessage(level: string, message: string): string {
  const timestamp = new Date().toISOString();
  return '[' + timestamp + '] [' + config.appName + '] [' + level.toUpperCase() + ']: ' + message;
}

export function createLogger() {
  return {
    info: (msg: string) => console.log(formatMessage('info', msg)),
    warn: (msg: string) => console.warn(formatMessage('warn', msg)),
    error: (msg: string) => console.error(formatMessage('error', msg)),
    debug: (msg: string) => {
      if (config.logLevel === 'debug') {
        console.debug(formatMessage('debug', msg));
      }
    }
  };
}
