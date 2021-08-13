import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class TasksService {
  async getAll(query = {}) {
    const tasks = await dbContext.Tasks.find(query).populate('creator')
    return tasks
  }

  async getOne(id, userId) {
    // const task = await dbContext.Tasks.findOne({ _id: id, creatorId: userId })
    const task = await dbContext.Tasks.findById(id).populate('creator')
    if (!task) {
      throw new BadRequest('Invalid Id')
    }
    if (task.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your task')
    }
    return task
  }

  async create(body) {
    const task = await dbContext.Tasks.create(body)
    return task
  }

  async destroy(id, userId) {
    const foundTask = await this.getOne(id, userId)
    if (foundTask.creatorId.toString() === userId) {
      const task = await dbContext.Tasks.findByIdAndDelete(id)
      if (!task) {
        throw new BadRequest('invalid Id')
      } return task
    }
  }

  async edit(body) {
    const foundTask = await this.getOne(body.id, body.creatorId)
    // FIXME you shouldnt do this.
    if (foundTask.creatorId.toString() === body.creatorId) {
      await dbContext.Tasks.findByIdAndDelete(body.id)
      await dbContext.Tasks.create(body)
      // const task = await dbContext.Tasks.findByIdAndUpdate(body.id, body, { new: true, runValidators: true })
    }
  }
}

export const tasksService = new TasksService()
