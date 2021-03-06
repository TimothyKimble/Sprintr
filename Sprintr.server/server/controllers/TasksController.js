import { Auth0Provider } from '@bcwdev/auth0provider'
import { notesService } from '../services/NotesService'
import { tasksService } from '../services/TasksService'
import BaseController from '../utils/BaseController'

export class TasksController extends BaseController {
  constructor() {
    super('api/tasks')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getAll)
      .get('/:id', this.getOne)
      .get('/:id/notes', this.getNotesIn)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.destroy)
  }

  async getAll(req, res, next) {
    try {
      const tasks = await tasksService.getAll({ creatorId: req.userInfo.id })
      res.send(tasks)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const task = await tasksService.getOne(req.params.id, req.userInfo.id)
      res.send(task)
    } catch (error) {
      next(error)
    }
  }

  async getNotesIn(req, res, next) {
    try {
      const notes = await notesService.getAll({ taskId: req.params.id })
      res.send(notes)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorId = req.userInfo.id
      const task = await tasksService.create(req.body)
      res.send(task)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const task = await tasksService.edit(req.body)
      res.send(task)
    } catch (error) {
      next(error)
    }
  }

  async destroy(req, res, next) {
    try {
      await tasksService.destroy(req.params.id, req.userInfo.id)
      res.send({ message: 'destroy Task' })
    } catch (error) {
      next(error)
    }
  }
}
