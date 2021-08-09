import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class SprintsService {
  async getAll(query = {}) {
    const sprints = await dbContext.Sprints.find(query).populate('creator')
    return sprints
  }

  async getOne(id, userId) {
    // const sprint = await dbContext.Sprints.findOne({ _id: id, creatorId: userId })
    const sprint = await dbContext.Sprints.findById(id).populate('creator')
    if (!sprint) {
      throw new BadRequest('Invalid Id')
    }
    if (sprint.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your sprint')
    }
    return sprint
  }

  async create(body) {
    const sprint = await dbContext.Sprints.create(body)
    return sprint
  }

  async destroy(id, userId) {
    const foundsprint = await this.getOne(id)
    if (foundsprint.creatorId === userId) {
      const sprint = await dbContext.Sprints.findByIdAndDelete(id)
      if (!sprint) {
        throw new BadRequest('invalid Id')
      } return sprint
    }
  }

  async edit(body) {
    const foundsprint = await this.getOne(body.id)
    if (foundsprint.creatorId === body.creatorId) {
      const sprint = await dbContext.Sprints.findByIdAndUpdate(body.id, body, { new: true, runValidators: true })
      if (!sprint) {
        throw new BadRequest('invalid Id')
      } return sprint
    }
  }
}

export const sprintsService = new SprintsService()
