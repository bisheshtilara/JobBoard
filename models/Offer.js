import { model, Schema, SchemaTypes } from 'mongoose'
import mongoose_delete from 'mongoose-delete'

const { ObjectId } = SchemaTypes

const offerSchema = new Schema(
  {
    title: String,
    requirements: {
      text: String,
      time: String, // full-time / part-time
      remote: String, // remote job / in office
      education: String
    },
    author: {
      type: ObjectId,
      ref: 'users'
    },
    active: {
      type: Boolean,
      default: true
    },
    banner: {
      lg: String,
      sm: String
    },
    duration: Number, // in months
    startDate: Date,
    validUntil: Date,
    deleteReason: String
  },
  {
    timestamps: true
  }
)

offerSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

offerSchema.virtual('subscribersCount', {
  ref: 'applications', // The model to use
  localField: '_id',
  foreignField: 'offer',
  count: true // And only get the number of docs
})

export default model('offers', offerSchema)
