import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const TaskSchema = new Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'review', 'done'],
    default: 'pending'
  },
  weight: { type: Number, required: true },
  sprintId: { type: ObjectId, ref: 'Sprint' },
  backlogItemId: { type: ObjectId, ref: 'BacklogItem' },
  projectId: { type: ObjectId, ref: 'Project', required: true },
  creatorId: { type: ObjectId, ref: 'Account', required: true }
},
{ timestamps: true, toJSON: { virtuals: true } }
)

TaskSchema.virtual('creator', {
  localField: 'creatorId',
  ref: 'Account',
  foreignField: '_id',
  justOne: true
})

TaskSchema.virtual('project', {
  localField: 'projectId',
  ref: 'Project',
  foreignField: '_id',
  justOne: true
})

TaskSchema.virtual('sprint', {
  localField: 'sprintId',
  ref: 'Sprint',
  foreignField: '_id',
  justOne: true
})
/** NOTE We could populate backlog item if we wanted to.  */
