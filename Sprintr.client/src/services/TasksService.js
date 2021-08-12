import { logger } from '../utils/Logger'
import { api } from './AxiosService'
class TasksService {
  async createTask(newTask) {
    // logger.log(newTask)
    logger.log('api URL:', api.baseURL)
    const res = await api.post('api/tasks', newTask)
    return res.data
  }

  async destroy(id) {
    // logger.log(newTask)
    const res = await api.delete('api/tasks/' + id)
    return res
  }

  async removeSprintId(id) {
    const foundTask = api.get('api/tasks/' + id)
    delete foundTask.sprintId
    const res = await api.put('api/tasks/' + id, foundTask)
    return res.data
  }
}
export const tasksService = new TasksService()
