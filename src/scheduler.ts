import { createLogger } from "./logger"

const logger = createLogger()
const tasks = new Map<string, {id: NodeJS.Timeout}>();

function scheduleTask(name: string, interval: number, task: () => void) {
  if (tasks.has(name)) {
    logger.warn('Task "' + name + '" already running, restarting');
    clearInterval(tasks.get(name).id);
  }

   logger.info('Scheduling task "' + name + '" every ' + interval + 'ms');

   const id = setInterval(() => {
    task()
   }, interval)

   tasks.set(name, {id})
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
