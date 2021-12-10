import logger from '@logger'
import Application from '@models/Application'
import Offer from '@models/Offer'
import OfferResource from '@resources/OfferResource'
import { asyncForEach } from '@utils/utils'
import { Types } from 'mongoose'
import sanitizeHtml from 'sanitize-html'
import RecruiterResource from '../resources/RecruiterResource'
const ObjectID = Types.ObjectId

export default class OfferController {
  static async getAll(req, res) {
    try {
      const offers = await Offer.find({})
        .sort({ createdAt: -1 })
        .populate('author')
        .exec()
      return res.json(OfferResource.collection(offers))
    } catch (err) {
      logger.error('Error at OfferController/getAll: ', err)
      return res.status(500).end()
    }
  }
  static async getOne(req, res) {
    if (!req.params?.id)
      return res.status(422).json({
        error: 'MISSING'
      })
    try {
      const offer = await Offer.findOne({ _id: req.params.id })
        .sort({ createdAt: -1 })
        .populate('author')
        .exec()
      if (!offer) return res.status(404).end()
      const applications = await Application.find({
        offer: offer._id
      })
        .populate('user')
        .exec()
      const subscribers = applications.map((s) =>
        new RecruiterResource(s.user).exec()
      )
      return res.json({
        offer,
        subscribers,
        subscribersCount: subscribers.length
      })
    } catch (err) {
      logger.error('Error at OfferController/getOne: ', err)
      return res.status(500).end()
    }
  }
  static async create(req, res) {
    if (!req.user.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    const extra = {}
    if (req.file) {
      extra.banner = req.file.transforms.reduce((images, tranform) => {
        images[tranform.id] = tranform.location
        return images
      }, {})
    }
    req.body.author = req.user._id
    const requirements = {
      text: sanitizeHtml(req.body?.requirements?.text || '', {
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
      }),
      time: req.body?.requirements?.time,
      remote: req.body?.requirements?.remote,
      education: req.body?.requirements?.education
    }
    try {
      const offer = await new Offer({
        ...req.body,
        requirements,
        ...extra
      }).save()

      const offerRes = new OfferResource(await offer.populate('author')).exec()
      return res.status(201).json(offerRes)
    } catch (err) {
      logger.error('Error at OfferController/create: ', err)
      return res.status(500).end()
    }
  }
  static async update(req, res) {
    if (!req.user.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    const offerCheck = await Offer.findById(req.params.id)
      .populate('author')
      .exec()
    if (req.user._id.toString() !== offerCheck.author._id.toString())
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    const extra = {}
    if (req.file) {
      extra.banner = req.file.transforms.reduce((images, tranform) => {
        images[tranform.id] = tranform.location
        return images
      }, {})
    }
    const requirements = {
      text: sanitizeHtml(req.body?.requirements?.text || '', {
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
      }),
      time: req.body?.requirements?.time,
      remote: req.body?.requirements?.remote,
      education: req.body?.requirements?.education
    }
    logger.info('Data:', req.body)
    try {
      const offer = await Offer.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $set: {
            ...req.body,
            requirements,
            ...extra
          }
        },
        {
          new: true
        }
      ).exec()
      const offerRes = new OfferResource(await offer.populate('author')).exec()
      return res.status(200).json(offerRes)
    } catch (err) {
      logger.error('Error at OfferController/update: ', err)
      return res.status(500).end()
    }
  }
  static async delete(req, res) {
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    if (!req.body?.deleteReason)
      req.body.deleteReason =
        'We are sorry, we have already filled this position.'
    try {
      const offer = await Offer.findById(req.params.id)
        .populate('author')
        .exec()
      if (!offer)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      if (
        (!req.user.isRecruiter ||
          req.user._id.toString() !== offer.author._id.toString()) &&
        !req.user?.isAdmin
      )
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      const applications = await Application.find({ offer: req.params.id })
        .populate('user')
        .exec()
      for (let i = 0; i < applications.length; i += 1) {
        const app = applications[i]
        app.cancelReason = req.body.deleteReason
        await app.save()
        // Notify user about offer cancellation (email or io to frontend)
        await Application.delete({ _id: app._id }).exec()
      }
      await Offer.delete({ _id: req.params.id }).exec()
      return res.status(200).end()
    } catch (err) {
      logger.error('Error at OfferController/delete: ', err)
      return res.status(500).end()
    }
  }
}
