import User from '@models/User'
import { accessTokenSecret } from '@env'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import logger from '@logger'
import UserService from '@services/UserService'

export const isLoggedIn =
  (isAdmin = false, optional = false) =>
  async (req, res, next) => {
    const accessToken = req.headers?.authorization?.replace('Bearer ', '')
    if (!optional && (!accessToken || accessToken === 'null')) {
      res.status(403)
      res.end('Unauthorized (A1)')
      return
    }

    try {
      const decoded = jwt.verify(accessToken, accessTokenSecret)
      if (!decoded?.user?._id && !optional) {
        res.status(401)
        res.json({
          error: 'Unauthorized (A4)'
        })
        return
      }
      const user = decoded?.user?._id
        ? await UserService.getUserBy('_id', decoded.user._id)
        : null
      if (isAdmin && !user?.isAdmin) {
        res.status(401)
        res.json({
          error: 'Unauthorized (A5)'
        })
        return
      }
      if (user) {
        // update user set lastActive
        await User.updateOne(
          { _id: user._id },
          {
            $set: { lastActive: new Date() }
          }
        ).exec()
        delete user.password // remove the password field
      }
      req.user = user
      next()
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (optional) {
          next()
          return
        }
        res.status(403)
        res.json({
          error: 'Unauthorized (A1)'
        })
        return
      }
      logger.error('Error at AuthMiddleware/isLoggedIn: ', error)
      res.status(500)
      res.json('Unauthorized (A3)')
    }
  }
