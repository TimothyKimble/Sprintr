import { Auth0Provider } from '@bcwdev/auth0provider'
import { backlogItemsService } from '../services/BacklogItemsService'
import { projectsService } from '../services/ProjectsService'
import { sprintsService } from '../services/SprintsService'
import { tasksService } from '../services/TasksService'
import BaseController from '../utils/BaseController'

export class ProjectsController extends BaseController {
  constructor() {
    super('api/projects')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getAll)
      .get('/:id', this.getOne)
      .get('/:id/backlogItems', this.getAllBacklogItemsIn)
      .get('/:id/sprints', this.getAllSprintsIn)
      .get('/:id/tasks', this.getAllTasksIn)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.destroy)
  }

  async getAll(req, res, next) {
    try {
      const projects = await projectsService.getAll({ creatorId: req.userInfo.id })
      res.send(projects)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const project = await projectsService.getOne(req.params.id, req.userInfo.id)
      res.send(project)
    } catch (error) {
      next(error)
    }
  }

  async getAllBacklogItemsIn(req, res, next) {
    try {
      const backlogItem = await backlogItemsService.getAll({ projectId: req.params.id })
      res.send(backlogItem)
    } catch (error) {
      next(error)
    }
  }

  async getAllSprintsIn(req, res, next) {
    try {
      const sprint = await sprintsService.getAll({ projectId: req.params.id })
      res.send(sprint)
    } catch (error) {
      next(error)
    }
  }

  async getAllTasksIn(req, res, next) {
    try {
      const task = await tasksService.getAll({ projectId: req.params.id })
      res.send(task)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorId = req.userInfo.id
      const project = await projectsService.create(req.body)
      res.send(project)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const project = await projectsService.edit(req.body)
      res.send(project)
    } catch (error) {
      next(error)
    }
  }

  async destroy(req, res, next) {
    try {
      await projectsService.destroy(req.params.id, req.userInfo.id)
      res.send({ message: 'destroy Project' })
    } catch (error) {
      next(error)
    }
  }
}
