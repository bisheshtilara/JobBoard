import { email_password, email_user, mailsFrom, mailsTo } from '@env'
import logger from '@logger'
import nodemailer from 'nodemailer'

export function simpleMailer(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email_user,
      pass: email_password
    }
  })
  transporter.sendMail({
    from: mailsFrom || email_user,
    to,
    subject,
    text
  })
}
