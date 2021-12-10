import { v4 as uuidv4 } from 'uuid'

import multer from 'multer'
import s3Storage from 'multer-s3-transform'
import aws from 'aws-sdk'
import config from '@config/upload'
import sharp from 'sharp'

aws.config.update({ region: 'eu-west-3' })
const s3 = new aws.S3()
const credentials = new aws.SharedIniFileCredentials({ profile: 'admin' })
s3.config.credentials = credentials

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'application/pdf'
  ]
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      {
        status: 'error',
        message: 'Invalid file type. Only jpg, png image files and pdf are allowed.'
      },
      false
    )
  }
}

const saveAvatarAndBanner = multer({
  storage: s3Storage({
    s3,
    bucket: config.bucket,
    acl: 'public-read',
    contentType: s3Storage.AUTO_CONTENT_TYPE,
    shouldTransform(req, file, cb) {
      const isImage = /^image/i.test(file.mimetype)
      cb(null, isImage)
    },
    key: (req, file, cb) => {
      const imageFileName = `users/${req.user._id}/${uuidv4()}.jpeg`
      const resumeFileName = `users/${req.user._id}/resume/${uuidv4()}.pdf`
      const newFilename = /pdf$/i.test(file.mimetype)
        ? resumeFileName
        : imageFileName
      cb(null, newFilename)
    },
    transforms: [
      {
        id: 'sm',
        key(req, file, cb) {
          const isBanner = file.fieldname === 'banner'
          const dir = isBanner ? 'banner' : 'avatar'
          const newFilename = `users/${req.user._id}/${dir}/${uuidv4()}-sm.jpeg`
          cb(null, newFilename)
        },
        transform(req, file, cb) {
          const isBanner = file.fieldname === 'banner'
          if (isBanner) {
            cb(null, sharp().resize(1920, 846).jpeg({ quality: 90 }))
          } else {
            cb(null, sharp().resize(100, 100).jpeg({ quality: 90 }))
          }
        }
      },
      {
        id: 'lg',
        key(req, file, cb) {
          const isBanner = file.fieldname === 'banner'
          const dir = isBanner ? 'banner' : 'avatar'
          const newFilename = `users/${req.user._id}/${dir}/${uuidv4()}-lg.jpeg`
          cb(null, newFilename)
        },
        transform(req, file, cb) {
          const isBanner = file.fieldname === 'banner'
          if (isBanner) {
            cb(null, sharp().resize(1920, 547).jpeg({ quality: 90 }))
          } else {
            cb(null, sharp().resize(500, 500).jpeg({ quality: 90 }))
          }
        }
      }
    ]
  }),
  fileFilter
})

const saveSessionBanner = multer({
  storage: s3Storage({
    s3,
    bucket: config.bucket,
    acl: 'public-read',
    contentType: s3Storage.AUTO_CONTENT_TYPE,
    shouldTransform(req, file, cb) {
      const isImage = /^image/i.test(file.mimetype)
      cb(null, isImage)
    },
    key: (req, file, cb) => {
      const newFilename = `users/${req.user._id}/${uuidv4()}.jpeg`
      cb(null, newFilename)
    },
    transforms: [
      {
        id: 'sm',
        key(req, file, cb) {
          const newFilename = `users/${
            req.user._id
          }/sessions/${uuidv4()}-sm.jpeg`
          cb(null, newFilename)
        },
        transform(req, file, cb) {
          cb(null, sharp().resize(1920, 846).jpeg({ quality: 90 }))
        }
      },
      {
        id: 'lg',
        key(req, file, cb) {
          const newFilename = `users/${
            req.user._id
          }/sessions/${uuidv4()}-lg.jpeg`
          cb(null, newFilename)
        },
        transform(req, file, cb) {
          cb(null, sharp().resize(1920, 547).jpeg({ quality: 90 }))
        }
      }
    ]
  }),
  fileFilter
})

module.exports = {
  saveAvatarAndBanner: saveAvatarAndBanner.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'resume', maxCount: 1}
  ]),
  saveSessionBanner: saveSessionBanner.single('banner')
}
