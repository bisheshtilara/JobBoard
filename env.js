import dotenv from 'dotenv'
import ms from 'ms'

dotenv.config()

export const port = process.env.PORT
export const mongoUri = process.env.MONGO_URI
export const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || 'TOP_TOP_SECRET'
// TODO: decrease the access token life and make use of the refresh token
export const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || ms('15 days')
export const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || 'TOP_SECRET'
export const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || 86400
export const sessionCookieName = 'jobboard-session'
export const email_user = process.env.EMAIL_USER
export const email_password = process.env.EMAIL_PASSWORD
export const mailsTo = ""
export const mailsFrom = ""