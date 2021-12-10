import logger from '@logger'
import Application from '@models/Application'
import Offer from '@models/Offer'
import ApplicationResource from '@resources/ApplicationResource'
import { asyncForEach } from '@utils/utils'

export default class ApplicationController {
  static async applyOffer(req, res) {
    if (!req.body?.offer)
      return res.status(422).json({
        error: 'Offer id is missing'
      })
    if (req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    try {
      const offer = await Offer.findOne({
        _id: req.body.offer
      })
        .populate('author')
        .lean()
        .exec()
      if (!offer)
        return res.status(404).json({
          error: 'Offer not found'
        })
      const application = await new Application({
        offer,
        user: req.user._id
      }).save()
      return res.status(201).json(
        new ApplicationResource(
          await application
            .populate([{
              path: 'offer',
              populate: { path: 'author' }
            }, 'user'])
        ).exec()
      )
    } catch (err) {
      logger.error('Error at ApplicationController/applyOffer: ', err)
      return res.status(500).end()
    }
  }
  static async getUserApplicationsList(req, res) {
    try {
      const applications = await Application.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate({
          path: 'offer',
          populate: { path: 'author' }
        })
        .exec()
      return res.json(ApplicationResource.collection(applications))
    } catch (err) {
      logger.error(
        'Error at ApplicationController/getUserApplicationsList: ',
        err
      )
      return res.status(500).end()
    }
  }
  static async getUserApplicationsListAdmin(req, res) {
    if (!req.params?.id)
      return res.status(422).json({
        error: 'MISSING'
      })
    try {
      const applications = await Application.find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .populate({
          path: 'offer',
          populate: { path: 'author' }
        })
        .exec()
      return res.json(ApplicationResource.collection(applications))
    } catch (err) {
      logger.error(
        'Error at ApplicationController/getUserApplicationsList: ',
        err
      )
      return res.status(500).end()
    }
  }
  static async getOfferApplicationsList(req, res) {
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const applications = await Application.find({ offer: req.params.id })
        .sort({ createdAt: -1 })
        .populate('user')
        .exec()
      return res.json(ApplicationResource.collection(applications))
    } catch (err) {
      logger.error(
        'Error at ApplicationController/getOfferApplicationsList: ',
        err
      )
      return res.status(500).end()
    }
  }
  static async getApplication(req, res) {
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const application = await Application.findOne({
        _id: req.params.id
      })
        .populate({
          path: 'offer',
          populate: { path: 'author' }
        })
        .populate('user')
        .exec()
      return res.json(new ApplicationResource(application).exec())
    } catch (err) {
      logger.error('Error at ApplicationController/getApplication: ', err)
      res.status(500).end()
    }
  }
  static async cancel(req, res) {
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    if (!req.body?.cancelReason)
      req.body.cancelReason = "I'm sorry. I have already found job."
    try {
      const application = await Application.findById(req.params.id)
        .populate('user')
        .lean()
        .exec()
      if (!application)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      if (req.user._id.toString() !== application.user._id.toString() && !req.user?.isAdmin)
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      await Application.findByIdAndUpdate(req.params.id, {
        $set: {
          cancelReason: req.body.cancelReason
        }
      }).exec()
      // Notify offer author about application cancellation (io to frontend)
      await Application.delete({ _id: req.params.id }).exec()
      return res.status(200).end()
    } catch (err) {
      logger.error('Error at ApplicationController/cancel: ', err)
      return res.status(500).end()
    }
  }
  static async acceptOrReject(req, res) {
    if (!req.params?.choice || !req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    if (req.params.choice !== 'accept' && req.params.choice !== 'reject')
      return res.status(400).json({
        error: 'WRONG_CHOICE'
      })
    if (req.params.choice === 'reject' && !req.body?.rejectReason)
      req.body.rejectReason = 'Sorry, we have found better candidature.'
    try {
      const application = await Application.findOne({
        _id: req.params.id
      })
        .populate('offer')
        .exec()
      if (application.offer.author._id.toString() !== req.user._id.toString())
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      if (req.params.choice === 'reject') {
        application.isAccepted = false
        application.isRejected = true
        application.rejectReason = req.body.rejectReason
      } else if (req.params.choice === 'accept') {
        application.isAccepted = true
        application.isRejected = false
      }
      await application.save()
      return res.json(application)
    } catch (err) {
      logger.error('Error at ApplicationController/acceptOrReject: ', err)
      return res.status(500).end()
    }
  }
}
