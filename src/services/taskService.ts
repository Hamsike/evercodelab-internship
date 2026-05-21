import { NotFoundError, ConflictError, ValidationError } from '../errors/index.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger('TaskService')
const tasks = new Map<string, NodeJS.Timeout>()

export interface Task {
  name: string
  interval: number
  isRunning: boolean
}

export function scheduleTask(name: string, interval: number, task: () => void): Task {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new ValidationError('Task name must be a non-empty string', { name })
  }
  
  if (typeof interval !== 'number' || interval <= 0) {
    throw new ValidationError('Interval must be a positive number', { interval })
  }
  
  if (typeof task !== 'function') {
    throw new ValidationError('Task must be a function', { taskType: typeof task })
  }
  
  if (tasks.has(name)) {
    throw new ConflictError(`Task "${name}"`, { name })
  }

  const id = setInterval(() => {
    try {
      task()
    } catch (err) {
      logger.error(`Task "${name}" execution failed`, 'scheduleTask')
    }
  }, interval)

  tasks.set(name, id)
  logger.info(`Task "${name}" scheduled every ${interval}ms`, 'scheduleTask')

  return { name, interval, isRunning: true }
}

export function stopTask(name: string): boolean {
  if (!tasks.has(name)) {
    throw new NotFoundError(`Task "${name}"`, { name })
  }
  const id = tasks.get(name)!

  clearInterval(id)
  tasks.delete(name)
  logger.info(`Task "${name}" stopped`, 'stopTask')
  return true
}

export function stopAllTasks(): number {
  let count = 0
  for (const [name, id] of tasks) {
    clearInterval(id)
    tasks.delete(name)
    count++
  }
  logger.info(`Stopped ${count} tasks`, 'stopAllTasks')
  return count
}

export function listTasks(): Task[] {
  return Array.from(tasks.keys()).map(name => ({
    name,
    interval: 0,
    isRunning: true
  }))
}
