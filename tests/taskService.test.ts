import { scheduleTask, stopTask, stopAllTasks, listTasks } from '../src/services/taskService'

describe('TaskService', () => {
  beforeEach(() => {
    stopAllTasks()
  })

  afterEach(() => {
    stopAllTasks()
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  describe('scheduleTask', () => {
    test('should schedule a task successfully', () => {
      const task = scheduleTask('test-task', 1000, () => {})
      expect(task.name).toBe('test-task')
      expect(task.interval).toBe(1000)
      expect(task.isRunning).toBe(true)
    })

    test('should throw error for empty name', () => {
      expect(() => scheduleTask('', 1000, () => {}))
        .toThrow('Task name must be a non-empty string')
    })

    test('should throw error for negative interval', () => {
      expect(() => scheduleTask('test', -100, () => {}))
        .toThrow('Interval must be a positive number')
    })

    test('should throw error for zero interval', () => {
      expect(() => scheduleTask('test', 0, () => {}))
        .toThrow('Interval must be a positive number')
    })

    test('should throw ConflictError for duplicate task', () => {
      scheduleTask('duplicate', 1000, () => {})
      expect(() => scheduleTask('duplicate', 1000, () => {}))
        .toThrow()
    })

    test('should execute task function on interval', async () => {
      let counter = 0
      const taskFn = () => { counter++ }
      
      scheduleTask('counter-task', 50, taskFn)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(counter).toBeGreaterThan(0)
      stopTask('counter-task')
    })
  })

  describe('stopTask', () => {
    test('should stop existing task and return true', () => {
      scheduleTask('stop-test', 1000, () => {})
      const result = stopTask('stop-test')
      expect(result).toBe(true)
    })

    test('should throw NotFoundError for non-existing task', () => {
      expect(() => stopTask('non-existing'))
        .toThrow()
    })
  })

  describe('stopAllTasks', () => {
    test('should stop all tasks and return count', () => {
      scheduleTask('task1', 1000, () => {})
      scheduleTask('task2', 2000, () => {})
      scheduleTask('task3', 3000, () => {})
      
      const count = stopAllTasks()
      expect(count).toBe(3)
      expect(listTasks()).toHaveLength(0)
    })

    test('should return 0 when no tasks', () => {
      const count = stopAllTasks()
      expect(count).toBe(0)
    })
  })

  describe('listTasks', () => {
    test('should return list of running tasks', () => {
      scheduleTask('list-task1', 1000, () => {})
      scheduleTask('list-task2', 2000, () => {})
      
      const tasks = listTasks()
      expect(tasks).toHaveLength(2)
      expect(tasks[0].name).toBe('list-task1')
      expect(tasks[1].name).toBe('list-task2')
      expect(tasks[0].isRunning).toBe(true)
    })

    test('should return empty array when no tasks', () => {
      const tasks = listTasks()
      expect(tasks).toHaveLength(0)
    })

    test('should update list after stopping tasks', () => {
      scheduleTask('to-stop', 1000, () => {})
      scheduleTask('to-keep', 1000, () => {})
      
      expect(listTasks()).toHaveLength(2)
      stopTask('to-stop')
      
      const tasks = listTasks()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].name).toBe('to-keep')
    })
  })
})
