import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { convertToQuery } from '../utils/Query'
import { api } from './AxiosService'
class BacklogItemsService {
  async getAllBacklogItems(query = { creatorId: AppState.user.id }) {
    const res = await api.get('api/backlogItems' + convertToQuery(query))
    logger.log(res.data)
    logger.log(AppState.account.id)
    AppState.projects = res.data
  }

  async createBacklogItem(rawBacklogITem) {
    let res = await api.post('api/backlogItems', rawBacklogITem)
    logger.log(res.data)
    res = await this.getAllProjects({ id: res.data.id })
    AppState.projects.push(res.data)
    return res.data
  }
}

export const backlogItemsService = new BacklogItemsService()
