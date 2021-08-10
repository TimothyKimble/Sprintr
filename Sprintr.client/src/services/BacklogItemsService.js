import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { convertToQuery } from '../utils/Query'
import { api } from './AxiosService'
import { projectsService } from './ProjectsService'
class BacklogItemsService {
  async getAllBacklogItems(query = { creatorId: AppState.user.id }) {
    const res = await api.get('api/backlogItems' + convertToQuery(query))
    AppState.projects = res.data
  }

  async createBacklogItem(rawBacklogItem) {
    const res = await api.post('api/backlogItems', rawBacklogItem)
    await projectsService.getAllBacklogItemsIn(rawBacklogItem.projectId)
    return res.data
  }
}

export const backlogItemsService = new BacklogItemsService()
