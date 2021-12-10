import logger from '@logger'
import { accessTokenLife } from '@env'
import User from '@models/User'
import {
  AlreadyExistsError,
  IncorrectPassword,
  MissingPassword,
  NotFoundError
} from '@utils/errors'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { asyncForEach } from '@utils/utils'
import { Types } from 'mongoose'
import sanitizeHtml from 'sanitize-html'
import UserResource from '@resources/UserResource'
import { validationResult } from 'express-validator'
import UserService from '@services/UserService'
import FacebookService from '@services/FacebookService'
import { simpleMailer } from '@helpers/email'
import RecruiterResource from '@resources/RecruiterResource'

const ObjectID = Types.ObjectId

export default class UserController {
  static async getAll(req, res) {
    try {
      const users = await User.find({}).exec()
      res.json(UserResource.collection(users))
    } catch (err) {
      logger.error('Error at UserController/getAll: ', err)
      return res.status(500).end()
    }
  }
  static async getMe(req, res) {
    return res.json(new UserResource(req.user).exec())
  }
  static async getOne(req, res) {
    if (!req.params?.id)
      return res.status(422).json({
        error: 'MISSING'
      })
    const userId = req.params.id.match(/^[0-9a-fA-F]{24}$/) && req.params.id
    try {
      const user = await User.findOne({
        $or: [{ _id: userId }, { username: req.params.id }]
      }).exec()
      return res.json(new UserResource(user).exec())
    } catch (err) {
      logger.error('Error at UserController/getOne: ', err)
      return res.status(500).end()
    }
  }
  static async verifyEmail(req, res) {
    if (!req.params?.code) return res.status(404).end()
    try {
      const user = await User.findOne({
        emailVerificationToken: req.params.code
      }).exec()
      if (!user || !user._id)
        return res.status(400).json({
          error: 'BAD_TOKEN'
        })
      user.validEmail = true
      user.emailVerificationToken = null
      await user.save()
      const accessToken = UserService.generateToken(user)
      res.status(200).json({
        token: accessToken,
        expiresIn: accessTokenLife
      })
    } catch (err) {
      logger.error('Error at UserController/verifyEmail: ', err)
      return res.status(500).end()
    }
  }
  static async register(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({
        error: 'MISSING'
      })
    try {
      const newUser = await UserService.register(req.body, req)
      const accessToken = UserService.generateToken(newUser)
      return res.status(201).json({
        token: accessToken,
        expiresIn: accessTokenLife
      })
    } catch (err) {
      if (err instanceof AlreadyExistsError)
        return res.status(401).json({
          error: 'ALREADY_EXISTS'
        })
      logger.error('Error at UserController/register: ', err)
      return res.status(500).end()
    }
  }
  static async update(req, res) {
    if (!req.user?._id)
      return res.status(422).json({
        error: 'MISSING'
      })
    // if (req.body.email) {
    //   const userSameEmail = await User.findOne({
    //     email: req.body.email.toLowerCase()
    //   })
    //     .lean()
    //     .exec()
    //   let usersEmails = await User.find({}).lean().exec()
    //   usersEmails.splice(usersEmails.indexOf(userSameEmail.email), 1)
    //   usersEmails = usersEmails.map((user) => user.email)
    //   if (userSameEmail?.email && usersEmails.includes(userSameEmail.email)) {
    //     res.status(400).json({
    //       error: 'ALREADY_EXISTS'
    //     })
    //     return
    //   }
    // }
    const extra = {}
    if (req?.files) {
      if ('avatar' in req.files) {
        extra.avatar = req.files.avatar[0].transforms.reduce(
          (images, tranform) => {
            images[tranform.id] = tranform.location
            return images
          },
          {}
        )
      }

      if ('banner' in req.files) {
        extra.banner = req.files.banner[0].transforms.reduce(
          (images, tranform) => {
            images[tranform.id] = tranform.location
            return images
          },
          {}
        )
      }
      if ('resume' in req.files) {
        extra.resume = req.files.resume[0].location
      }
    }
    if (!req.body.password) delete req.body.password
    else req.body.password = bcrypt.hashSync(req.body.password)
    delete req.body.isAdmin
    const sanitizedBio = sanitizeHtml(req.body?.bio || '', {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'span',
        'h1',
        'h2'
      ]),
      allowedAttributes: { span: ['style'] },
      allowedStyles: {
        '*': {
          color: [
            /^#(0x)?[0-9a-f]+$/i,
            /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
          ]
        }
      }
    })
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            ...req.body,
            bio: sanitizedBio,
            ...extra
          }
        },
        {
          new: true
        }
      ).exec()
      return res.json(new UserResource(user).exec())
    } catch (err) {
      logger.error('Error at UserController/update: ', err)
      return res.status(500).json(err)
    }
  }
  static async login(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({
          error: 'MISSING'
        })
      const user = await UserService.login(
        req.body.email.toLowerCase(),
        req.body.password
      )
      const accessToken = UserService.generateToken(user)
      return res.status(200).json({
        token: accessToken,
        expiresIn: accessTokenLife
      })
    } catch (err) {
      if (err instanceof NotFoundError)
        return res.status(422).json({
          error: 'NO_USER'
        })
      if (err instanceof MissingPassword)
        return res.status(422).json({
          error: 'RESET'
        })
      if (err instanceof IncorrectPassword)
        return res.status(422).json({
          error: 'INCORRECT'
        })
      logger.error('Error at UserController/loginUser: ', err)
      return res.status(500).end()
    }
  }
  static logout(req, res) {
    try {
      res.status(200).end()
    } catch (err) {
      logger.error('Error at UserController/logout: ', err)
      res.status(500).end()
    }
  }
  static async sendResetPasswordEmail(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({
        error: 'MISSING'
      })
    try {
      const user = await User.findOne({
        email: req.body.email.toLowerCase()
      })
        .lean()
        .exec()
      if (!user)
        return res.status(404).json({
          message: `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`
        })
      const resetPasswordToken = crypto.randomBytes(64).toString('hex')
      const resetPasswordExpires = Date.now() + 3600000
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            resetPasswordToken,
            resetPasswordExpires
          }
        }
      ).exec()
      const mailOrigin = req.headers?.origin || 'http://localhost:3000/v1/users'
      simpleMailer(
        user.email,
        'JobBoard - reset password',
        `Hello! Click on following link to reset your password: ${mailOrigin}/reset/${resetPasswordToken}`
      )
      res.status(200).json({
        message: `A reset email has been sent to ${user.email}.`
      })
    } catch (err) {
      logger.error('Error at UserController/sendResetPasswordEmail: ', err)
      res.status(500).end()
    }
  }
  static async verifyResetPasswordCode(req, res) {
    const code = req.params.code
    try {
      const user = await User.findOne({
        resetPasswordToken: code,
        resetPasswordExpires: { $gt: Date.now() }
      }).exec()
      if (!user)
        return res.status(401).json({
          error: 'BAD_TOKEN'
        })
      return res.status(200).json({ email: user.email })
    } catch (err) {
      logger.error('Error at UserController/verifyResetPasswordCode: ', err)
    }
  }
  static async resetPassword(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({
        error: 'MISSING'
      })
    try {
      const code = req.params.code
      const user = await User.findOne({
        resetPasswordToken: code,
        resetPasswordExpires: { $gt: Date.now() }
      }).exec()
      if (!user)
        return res.status(401).json({
          error: 'BAD_TOKEN'
        })
      user.password = bcrypt.hashSync(req.body.password)
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
      return res.status(200).end()
    } catch (err) {
      logger.error('Error at UserController/resetPassword: ', err)
      return res.status(500).end()
    }
  }
  static async getAllRecruiters(req, res) {
    try {
      const recruiters = await User.find({
        isRecruiter: true
      })
        .lean()
        .exec()
      return res.json(RecruiterResource.collection(recruiters))
    } catch (err) {
      logger.error('Error at UserController/getAllRecruiters: ', err)
      return res.status(500).end()
    }
  }
  static async getRecruiter(req, res) {
    if (!req.params?.id)
      return res.status(404).json({
        error: 'NOT FOUND'
      })
    try {
      const recruiter = await User.findOne({
        isRecruiter: true,
        _id: req.params.id
      })
        .lean()
        .exec()
      return res.json(new RecruiterResource(recruiter).exec())
    } catch (err) {
      logger.error('Error at UserController/getRecruiter: ', err)
      return res.status(500).end()
    }
  }
  static async loginWithFacebook(req, res) {
    try {
      const { accessToken, expiresIn, userID } = req.body
      if (!accessToken || !expiresIn || !userID) {
        return res.status(403)
      }
      const origin = req.headers.origin || 'localhost'
      // Connect / Link facebook account if the user already exists, if not, create a new account and logged them in
      const fb = new FacebookService(req.user)
      await fb.connect(origin, accessToken, expiresIn, userID)

      const jwtToken = UserService.generateToken(fb.user)

      return res.status(201).json({
        token: jwtToken,
        expiresIn: accessTokenLife
      })
    } catch (e) {
      logger.error('Error at UserController/loginWithFacebook: ', e)
      res.status(500).end()
    }
  }
  static async deleteUser(req, res) {
    if (!req.params?.id)
      return res.status(422).json({
        error: 'MISSING'
      })
    try {
      const user = await User.findById(req.params.id).lean().exec()
      if (!user)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      await User.findByIdAndUpdate(req.params.id, {
        $set: {
          deleteReason: req.body?.deleteReason || 'On your request'
        }
      }).exec()
      await User.delete({ _id: req.params.id }).exec()
      res.status(200).end()
    } catch (err) {
      logger.error('Error at UserController/deleteUser: ', err)
      res.status(500).end()
    }
  }
}
