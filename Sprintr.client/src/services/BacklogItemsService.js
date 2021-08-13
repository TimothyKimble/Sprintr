import { AppState } from '../AppState'
// import { logger } from '../utils/Logger'
import { convertToQuery } from '../utils/Query'
import { api } from './AxiosService'
import { projectsService } from './ProjectsService'
import { tasksService } from './TasksService'
class BacklogItemsService {
  async getAllBacklogItems(query = { creatorId: AppState.user.id }) {
    const res = await api.get('api/backlogItems' + convertToQuery(query))
    AppState.backlogItems = res.data
    return res.data
  }

  async getAllTasksIn(id) {
    const res = await api.get('api/backlogItems/' + id + '/tasks')
    // logger.log('res ITems', res)
    AppState.tasks = res.data
    return res.data
  }

  async createBacklogItem(rawBacklogItem) {
    const res = await api.post('api/backlogItems', rawBacklogItem)
    await projectsService.getAllBacklogItemsIn(rawBacklogItem.projectId)
    return res.data
  }

  async removeTaskPerm(id) {
    await tasksService.destroy(id)
  }

  async removeBacklogItem(id) {
    await this.removeBacklogItemsTasks(id)
    await api.delete('api/backlogItems/' + id)
  }

  async removeBacklogItemsTasks(id) {
    const allTasks = await this.getAllTasksIn(id)
    for (let i = 0; i < allTasks.length; i++) {
      await tasksService.destroy(allTasks[i].id)
    }
  }
}

export const backlogItemsService = new BacklogItemsService()
