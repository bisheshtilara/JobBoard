import logger from '@logger'
import User from '@models/User'
import bcrypt from 'bcryptjs'
import {
  AlreadyExistsError,
  IncorrectPassword,
  MissingPassword,
  NotFoundError
} from '@utils/errors'
import jwt from 'jsonwebtoken'
import {
  accessTokenLife,
  accessTokenSecret
  // refreshTokenLife,
  // refreshTokenSecret
} from '@env'
import crypto from 'crypto'
import { asyncForEach } from '@utils/utils'
import moment from 'moment'

export default class UserService {
  static async register(user, req = null) {
    const oldUser = await UserService.getUserBy('email', user.email)
    if (oldUser?._id) throw new AlreadyExistsError()
    const emailVerificationToken = crypto.randomBytes(64).toString('hex')
    const newUser = await new User({
      email: user?.email.toLowerCase(),
      firstname: user?.firstname,
      lastname: user?.lastname,
      password: bcrypt.hashSync(user?.password),
      isRecruiter: user?.isRecruiter || false,
      isSearching: !user?.isRecruiter || true,
      phone: user?.phone,
      website: user?.website,
      gender: user?.gender,
      languages: user?.languages,
      exp_edu: user?.exp_edu,
      birthday: user?.birthday ? moment() : null,
      bio: user?.bio,
      organization: user?.organization,
      emailVerificationToken
    }).save()
    return newUser
  }
  static async login(email, password) {
    const user = await UserService.getUserBy('email', email)
    if (!user)
      throw new NotFoundError()
    if (!user?.password)
      throw new MissingPassword()
    if (!bcrypt.compareSync(password, user.password))
      throw new IncorrectPassword()
    return user
  }
  static async getUserBy(field, value) {
    if (!field) return null
    try {
      const filter = {}
      filter[field] = value.toLowerCase()
      return await User.findOne(filter).exec()
    } catch (err) {
      logger.error('Error in UserService/GetUserBy: ', err)
    }
  }
  static generateToken(user) {
    const body = { _id: user._id, email: user.email }
    const accessToken = jwt.sign({ user: body }, accessTokenSecret, {
      algorithm: 'HS256',
      expiresIn: accessTokenLife
    })
    return accessToken
  }
}
