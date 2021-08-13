import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { api } from './AxiosService'
class NotesService {
  async destroy(id) {
    // logger.log(newTask)
    const res = await api.delete('api/notes/' + id)
    AppState.notes.filter(n => n.id !== id)
    return res
  }
}
export const notesService = new NotesService()
