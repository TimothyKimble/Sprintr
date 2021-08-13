import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { api } from './AxiosService'
class TasksService {
  async createTask(newTask) {
    // logger.log(newTask)
    // logger.log('api URL:', api.baseURL)
    const res = await api.post('api/tasks', newTask)
    AppState.tasks.push(res.data)
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
    // logger.log('Found Task', foundTask)
    const res = await api.put('api/tasks/' + id, foundTask)
    AppState.tasks = AppState.tasks.filter(t => t.id !== id)
    return res.data
  }

  async editTask(rawTask) {
    await api.put('api/tasks/' + rawTask.id, rawTask)
  }

  async addNote(rawNote) {
    await api.post('api/notes', rawNote)
  }

  async getNotesIn(id) {
    const res = await api.get('api/tasks/' + id + '/notes')
    AppState.notes.id = res.data
    // NOTE will show all notes
    // logger.log('AppState Notes:', AppState.notes.id)
  }
}
export const tasksService = new TasksService()
