import { logger } from '../utils/Logger'
import { api } from './AxiosService'
class TasksService {
  async createTask(newTask) {
    logger.log(newTask)
    const res = await api.post('api/tasks', newTask)
    return res.data
  }
}
export const tasksService = new TasksService()
