import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class NotesService {
  async getAll(query = {}) {
    const notes = await dbContext.Notes.find(query).populate('creator')
    return notes
  }

  async getOne(id, userId) {
    // const note = await dbContext.Notes.findOne({ _id: id, creatorId: userId })
    const note = await dbContext.Notes.findById(id).populate('creator')
    if (!note) {
      throw new BadRequest('Invalid Id')
    }
    if (note.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your note')
    }
    return note
  }

  async create(body) {
    const note = await dbContext.Notes.create(body)
    return note
  }

  async destroy(id, userId) {
    const foundNote = await this.getOne(id)
    if (foundNote.creatorId === userId) {
      const note = await dbContext.Notes.findByIdAndDelete(id)
      if (!note) {
        throw new BadRequest('invalid Id')
      } return note
    }
  }
}

export const notesService = new NotesService()
