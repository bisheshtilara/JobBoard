import { model, Schema, SchemaTypes } from 'mongoose'
import mongoose_delete from 'mongoose-delete'

const { ObjectId } = SchemaTypes

const applicationSchema = new Schema(
  {
    offer: { type: ObjectId, ref: 'offers' },
    user: { type: ObjectId, ref: 'users' },
    cancelReason: String,
    isAccepted: {type: Boolean, default: false},
    isRejected: {type: Boolean, default: false},
    rejectReason: String
  }, {
    timestamps: true
  }
)

applicationSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

export default model('applications', applicationSchema)