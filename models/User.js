import { model, Schema, SchemaTypes } from 'mongoose'
import mongoose_delete from 'mongoose-delete'

const { ObjectId } = SchemaTypes

const userSchema = new Schema(
  {
    email: {
      type: String,
      index: {
        unique: true
      }
    },
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    phone: String,
    languages: [
      {
        name: String,
        level: String
      }
    ],
    exp_edu: [
      {
        title: String,
        organization: String,
        date_start: Date,
        date_end: Date,
        type: String,
        location: String
      }
    ],
    isSearching: {
      type: Boolean,
      default: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isRecruiter: {
      type: Boolean,
      default: false
    },
    socialAccounts: {
      facebook: {
        accessToken: String,
        expiresIn: Number,
        userID: String,
        link: String
      },
      linkedin: {
        accessToken: String,
        expiresIn: Number,
        userID: String,
        link: String
      },
      github: {
        accessToken: String,
        expiresIn: Number,
        userID: String,
        link: String
      }
    },
    website: String,
    gender: String,
    birthday: Date,
    bio: String,
    organization: String,
    validEmail: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      required: false
    },
    resetPasswordToken: {
      type: String,
      required: false
    },
    resetPasswordExpires: {
      type: Date,
      required: false
    },
    avatar: {
      sm: {
        type: String
      },
      lg: {
        type: String
      }
    },
    banner: {
      sm: {
        type: String
      },
      lg: {
        type: String
      }
    },
    resume: String,
    lastActive: Date,
    deleteReason: String
  },
  {
    timestamps: true
  }
)

userSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

export default model('users', userSchema)
