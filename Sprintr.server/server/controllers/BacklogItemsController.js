import { Auth0Provider } from '@bcwdev/auth0provider'
import { backlogItemsService } from '../services/BacklogItemsService'
import BaseController from '../utils/BaseController'

export class BacklogItemsController extends BaseController {
  constructor() {
    super('api/backlogItems')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getAll)
      .get('/:id', this.getOne)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.destroy)
  }

  async getAll(req, res, next) {
    try {
      const backlogItems = await backlogItemsService.getAll({ creatorId: req.userInfo.id })
      res.send(backlogItems)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const backlogItem = await backlogItemsService.getOne(req.params.id, req.userInfo.id)
      res.send(backlogItem)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorId = req.userInfo.id
      const backlogItem = await backlogItemsService.create(req.body)
      res.send(backlogItem)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const backlogItem = await backlogItemsService.edit(req.body)
      res.send(backlogItem)
    } catch (error) {
      next(error)
    }
  }

  async destroy(req, res, next) {
    try {
      await backlogItemsService.destroy(req.params.id, req.userInfo.id)
      res.send({ message: 'destroy Backlog' })
    } catch (error) {
      next(error)
    }
  }
}
