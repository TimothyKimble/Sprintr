import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class BacklogItemsService {
  async getAll(query = {}) {
    const backlogItems = await dbContext.BacklogItems.find(query).populate('creator')
    return backlogItems
  }

  async getOne(id, userId) {
    // const backlogItem = await dbContext.BacklogItems.findOne({ _id: id, creatorId: userId })
    const backlogItem = await dbContext.BacklogItems.findById(id).populate('creator')
    if (!backlogItem) {
      throw new BadRequest('Invalid Id')
    }
    if (backlogItem.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your backlogItem')
    }
    return backlogItem
  }

  async create(body) {
    const backlogItem = await dbContext.BacklogItems.create(body)
    return backlogItem
  }

  async destroy(id, userId) {
    const foundbacklogItem = await this.getOne(id, userId)
    if (foundbacklogItem.creatorId.toString() === userId) {
      const backlogItem = await dbContext.BacklogItems.findByIdAndDelete(id)
      if (!backlogItem) {
        throw new BadRequest('invalid Id')
      } return backlogItem
    }
  }

  async edit(body) {
    const foundbacklogItem = await this.getOne(body.id)
    if (foundbacklogItem.creatorId.toString() === body.creatorId) {
      const backlogItem = await dbContext.BacklogItems.findByIdAndUpdate(body.id, body, { new: true, runValidators: true })
      if (!backlogItem) {
        throw new BadRequest('invalid Id')
      } return backlogItem
    }
  }
}

export const backlogItemsService = new BacklogItemsService()
