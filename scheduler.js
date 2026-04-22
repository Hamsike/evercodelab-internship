const { createLogger } = require('./src/logger.js');

const logger = createLogger()
const tasks = new Map();

/**
 * Управление периодическими задачами
 * @param {string} name - Название задачи
 * @param {number} interval - Интервал запуска в миллисекундах
 * @param {Function} task - Функция для выполнения
 */

function scheduleTask(name, interval, task) {
  if (tasks.has(name)) {
    logger.warn('Task "' + name + '" already running, restarting');
    clearInterval(tasks.get(name).id);
  }

   logger.info('Scheduling task "' + name + '" every ' + interval + 'ms');

   const id = setInterval(() => {
    task()
   }, interval)

   tasks.set(name, {id, interval})
}

scheduleTask('running-logger', 10000, () => {
  logger.info('running');
});

process.on('SIGINT', () => {
  logger.info('Shutting down...')
  for (const [name, {id}] of tasks) {
    clearInterval(id)
    logger.info('Stopped task: "' + name + '"');
  }
  logger.info('Graceful shutdown complete')
  process.exit(0);
})

logger.info('=== Scheduler started ===');
logger.info('Task "running" will log every 10 seconds');
logger.info('Press Ctrl+C to stop');
