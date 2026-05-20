import { NotFoundError } from '../errors/index.js'
import { ConflictError } from '../errors/index.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger()
const tasks = new Map<string, NodeJS.Timeout>()

export interface Task {
  name: string
  interval: number
  isRunning: boolean
}

export function scheduleTask(name: string, interval: number, task: () => void): Task {
  if (tasks.has(name)) {
    throw new ConflictError(`Task "${name}"`, { name })
  }

  const id = setInterval(() => {
    try {
      task()
    }
    catch (err) {
      logger.error(`Task "${name}" execution failed`)
    }
  }, interval)

  tasks.set(name, id)
  logger.info(`Task "${name}" scheduled every ${interval}ms`)

  return { name, interval, isRunning: true }
}

export function stopTask(name: string): boolean {
  if (!tasks.has(name)) {
    throw new NotFoundError(`Task "${name}"`, { name })
  }
  const id = tasks.get(name)
  
  clearInterval(id)
  tasks.delete(name)
  logger.info(`Task "${name}" stopped`)
  return true
}

export function stopAllTasks(): number {
  let count = 0
  for (const [name] of tasks) {
    stopTask(name)
    count++
  }
  logger.info(`Stopped ${count} tasks`)
  return count
}

export function listTasks(): Task[] {
  return Array.from(tasks.keys()).map(name => ({
    name,
    interval: 0,
    isRunning: true
  }))
}