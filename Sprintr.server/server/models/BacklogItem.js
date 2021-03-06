import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const BacklogItemSchema = new Schema({
  name: { type: String, required: true },
  isOpen: { type: Boolean, default: true },
  color: { type: String, required: true },
  body: { type: String, required: true },
  projectId: { type: ObjectId, ref: 'Project', required: true },
  creatorId: { type: ObjectId, ref: 'Account', required: true }
},
{ timestamps: true, toJSON: { virtuals: true } }
)

BacklogItemSchema.virtual('creator', {
  localField: 'creatorId',
  ref: 'Account',
  foreignField: '_id',
  justOne: true
})

BacklogItemSchema.virtual('project', {
  localField: 'projectId',
  ref: 'Project',
  foreignField: '_id',
  justOne: true
})
