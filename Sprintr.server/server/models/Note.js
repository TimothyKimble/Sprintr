import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const NoteSchema = new Schema(
  {
    body: { type: String, required: true },
    taskId: { type: ObjectId, ref: 'Task', required: true },
    creatorId: { type: ObjectId, ref: 'Account', required: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

NoteSchema.virtual('creator', {
  localField: 'creatorId',
  ref: 'Account',
  foreignField: '_id',
  justOne: true
})
