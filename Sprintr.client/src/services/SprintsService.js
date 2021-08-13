import { AppState } from '../AppState'
import { api } from './AxiosService'
import { projectsService } from './ProjectsService'
import { tasksService } from './TasksService'

class SprintsService {
  async removeTask(id) {
    await tasksService.removeSprintId(id)
  }

  async createSprint(rawSprint) {
    const res = await api.post('api/sprints', rawSprint)
    await projectsService.getAllSprintsIn(rawSprint.projectId)
    return res.data
  }

  async removeSprint(id) {
    await api.delete('api/sprints/' + id)
  }

  async removeSprintTasks(id) {
    const allTasks = await this.getAllTasksIn(id)
    for (let i = 0; i < allTasks.length; i++) {
      await tasksService.removeSprintId(allTasks[i].id)
    }
    await this.removeSprint(id)
  }

  async getAllTasksIn(id) {
    const res = await api.get('api/sprints/' + id + '/tasks')
    // logger.log('res ITems', res)
    AppState.tasks = res.data
    return res.data
  }
}

export const sprintsService = new SprintsService()
