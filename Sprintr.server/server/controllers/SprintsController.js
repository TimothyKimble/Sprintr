import { Auth0Provider } from '@bcwdev/auth0provider'
import { sprintsService } from '../services/SprintsService'
import { tasksService } from '../services/TasksService'
import BaseController from '../utils/BaseController'

export class SprintsController extends BaseController {
  constructor() {
    super('api/sprints')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getAll)
      .get('/:id', this.getOne)
      .get('/:id/tasks', this.getAllTasksIn)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.destroy)
  }

  async getAll(req, res, next) {
    try {
      const sprints = await sprintsService.getAll({ creatorId: req.userInfo.id })
      res.send(sprints)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const sprint = await sprintsService.getOne(req.params.id, req.userInfo.id)
      res.send(sprint)
    } catch (error) {
      next(error)
    }
  }

  async getAllTasksIn(req, res, next) {
    try {
      const task = await tasksService.getAll({ sprintId: req.params.id })
      res.send(task)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorId = req.userInfo.id
      const sprint = await sprintsService.create(req.body)
      res.send(sprint)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const sprint = await sprintsService.edit(req.body)
      res.send(sprint)
    } catch (error) {
      next(error)
    }
  }

  async destroy(req, res, next) {
    try {
      await sprintsService.destroy(req.params.id, req.userInfo.id)
      res.send({ message: 'destroy Sprint' })
    } catch (error) {
      next(error)
    }
  }
}
