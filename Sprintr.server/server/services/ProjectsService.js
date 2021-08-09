import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class ProjectsService {
  async getAll(query = {}) {
    const projects = await dbContext.Projects.find(query).populate('creator')
    return projects
  }

  async getOne(id, userId) {
    // const project = await dbContext.Projects.findOne({ _id: id, creatorId: userId })
    const project = await dbContext.Projects.findById(id).populate('creator')
    if (!project) {
      throw new BadRequest('Invalid Id')
    }
    if (project.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your project')
    }
    return project
  }

  async create(body) {
    const project = await dbContext.Projects.create(body)
    return project
  }

  async destroy(id, userId) {
    const foundproject = await this.getOne(id)
    if (foundproject.creatorId === userId) {
      const project = await dbContext.Projects.findByIdAndDelete(id)
      if (!project) {
        throw new BadRequest('invalid Id')
      } return project
    }
  }

  async edit(body) {
    const foundproject = await this.getOne(body.id)
    if (foundproject.creatorId === body.creatorId) {
      const project = await dbContext.Projects.findByIdAndUpdate(body.id, body, { new: true, runValidators: true })
      if (!project) {
        throw new BadRequest('invalid Id')
      } return project
    }
  }
}

export const projectsService = new ProjectsService()
