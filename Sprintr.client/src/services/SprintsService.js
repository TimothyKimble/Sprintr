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
}

export const sprintsService = new SprintsService()
