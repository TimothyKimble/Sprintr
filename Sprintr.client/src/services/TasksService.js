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

  async editTask(rawTask) {
    await api.put('api/tasks/' + rawTask.id, rawTask)
  }

  async addNote(rawNote) {
    await api.post('api/notes', rawNote)
  }
}
export const tasksService = new TasksService()
