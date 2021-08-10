import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { convertToQuery } from '../utils/Query'
import { api } from './AxiosService'
class ProjectsService {
  async getAllProjects(query = { creatorId: AppState.user.id }) {
    const res = await api.get('api/projects' + convertToQuery(query))
    AppState.projects = res.data
  }

  async createProject(rawProject) {
    const res = await api.post('api/projects', rawProject)
    await this.getAllProjects()
    // AppState.projects.push(res.data[0])
    return res.data.id
  }

  async getAllBacklogItemsIn(id) {
    const res = await api.get('api/projects/' + id + '/backlogItems')
    logger.log(res.data)
    AppState.backlogItems = res.data
  }

  // TODO do all deletes
  async destroyProject(id) {
    await api.delete('api/projects/' + id)
    logger.log({ message: 'Delorted Project' })
    AppState.projects = AppState.projects.filter(p => p.id !== id)
  }
}

export const projectsService = new ProjectsService()
