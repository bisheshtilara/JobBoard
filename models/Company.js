import { model, Schema, SchemaTypes } from 'mongoose'
import mongoose_delete from 'mongoose-delete'

const { ObjectId } = SchemaTypes

const companySchema = new Schema({
  title: String,
  description: {
    short: String,
    long: String
  },
  size: String,
  nWorkers: Number,
  yearCreated: Number,
  address: String,
  recruitAreas: [String],
  isPartner: {
    type: Boolean,
    default: false
  },
  employees: [
    {
      type: ObjectId,
      ref: 'users'
    }
  ],
  subscribers: [
    {
      type: ObjectId,
      ref: 'users'
    }
  ]
},
{
  timestamps: true
})

companySchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

export default model('companies', companySchema)
