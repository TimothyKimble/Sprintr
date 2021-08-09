import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { convertToQuery } from '../utils/Query'
import { api } from './AxiosService'
class ProjectsService {
  async getAllProjects(query = { creatorId: AppState.user.id }) {
    const res = await api.get('api/projects' + convertToQuery(query))
    logger.log(res.data)
    logger.log(AppState.account.id)
    AppState.projects = res.data
  }

  async createProject(rawProject) {
    let res = await api.post('api/projects', rawProject)
    logger.log(res.data)
    res = await this.getAllProjects({ id: res.data.id })
    AppState.projects.push(res.data)
    return res.data
  }
}

export const projectsService = new ProjectsService()
