import mongoose from 'mongoose'
import { Value as ValueSchema } from '../models/Value'
import { AccountSchema } from '../models/Account'
import { BacklogItemSchema } from '../models/BacklogItem'
import { NoteSchema } from '../models/Note'
import { TaskSchema } from '../models/Task'
import { SprintSchema } from '../models/Sprint'
import { ProjectSchema } from '../models/Project'

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);
  Notes = mongoose.model('Note', NoteSchema);
  Tasks = mongoose.model('Task', TaskSchema);
  BacklogItems = mongoose.model('BacklogItem', BacklogItemSchema);
  Sprints = mongoose.model('Sprint', SprintSchema);
  Projects = mongoose.model('Project', ProjectSchema);
}

export const dbContext = new DbContext()
