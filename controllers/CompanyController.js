import logger from '@logger'
import Company from '@models/Company'
import User from '@models/User'
import CompanyResource from '@resources/CompanyResource'

export default class CompanyController {
  static async getAll(req, res) {
    try {
      const companies = await Company.find({})
        .sort({ createdAt: -1 })
        .populate('subscribers')
        .exec()
      if (!companies || !companies[0])
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      return res.json(CompanyResource.collection(companies))
    } catch (err) {
      logger.error('Error at CompanyController/getAll: ', err)
      return res.status(500).end()
    }
  }
  static async getOne(req, res) {
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const company = await Company.findById(req.params.id)
        .populate('subscribers')
        .exec()
      if (!company)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      return res.json(CompanyResource(company))
    } catch (err) {
      logger.error('Error at ComapnyController/getOne: ', err)
      return res.status(500).end()
    }
  }
  static async create(req, res) {
    if (!req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (req.body?.description?.long) {
      if (!req.body?.description?.short)
        req.body.description.short =
          req.body.description.long.length > 10
            ? req.body.description.long.substr(0, 9) + '&hellip;'
            : req.body.description.long
    }
    try {
      const company = await new Company({
        ...req.body,
        description: sanitizeHtml(req.body?.description || '', {
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
      }).save()
      return res
        .status(201)
        .json(new CompanyResource(await company.populate('subscribers')).exec())
    } catch (err) {
      logger.error('Error at CompanyController/create: ', err)
      return res.status(500).end()
    }
  }
  static async update(req, res) {
    if (!req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      let company = await Company.findById(req.params.id)
        .populate('employees')
        .exec()
      if (!company.employees.includes(req.user._id))
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      company = await Company.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
            description: sanitizeHtml(req.body?.description || '', {
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
          }
        },
        { new: true }
      ).exec()
      return res.json(CompanyResource(company))
    } catch (err) {
      logger.error('Error at ComapnyController/update: ', err)
      return res.status(500).end()
    }
  }
  static async delete(req, res) {
    if (!req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (!req.params?.id)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const company = await Company.findById(req.params.id)
        .populate('employees')
        .exec()
      if (!company.employees.includes(req.user._id))
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      await Company.delete({ _id: req.params.id }).exec()
      res.status(200).end()
    } catch (err) {
      logger.error('Error at CompanyController/delete: ', err)
      return res.status(500).end()
    }
  }
  static async addEmployee(req, res) {
    if (!req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (!req.params?.id || !req.body?.employeeId)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const newEmployee = await User.findById(req.body.employeeId).exec()
      if (!newEmployee)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      let company = await Company.findById(req.params.id)
        .populate('employees')
        .exec()
      if (!company.employees.includes(req.user._id))
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      company = await Company.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $push: {
            employees: newEmployee._id
          }
        },
        {
          new: true
        }
      ).exec()
      return res.json(CompanyResource(company))
    } catch (err) {
      logger.error('Error at CompanyController/addEmployee: ', err)
      return res.status(500).end()
    }
  }
  static async removeEmployee(req, res) {
    if (!req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (!req.params?.id || !req.body?.employeeId)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const newEmployee = await User.findById(req.body.employeeId).exec()
      if (!newEmployee)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      let company = await Company.findById(req.params.id)
        .populate('employees')
        .exec()
      if (!company.employees.includes(req.user._id))
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      company = await Company.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $pull: {
            employees: newEmployee._id
          }
        },
        {
          new: true
        }
      ).exec()
      return res.json(CompanyResource(company))
    } catch (err) {
      logger.error('Error at CompanyController/removeEmployee: ', err)
      return res.status(500).end()
    }
  }
  static async subscribe(req, res) {
    if (!req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (!req.params?.id || !req.body?.userId)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const user = await User.findById(req.body.userId).exec()
      if (!user)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      let company = await Company.findById(req.params.id)
        .populate('employees')
        .populate('subscribers')
        .exec()
      if (!company.employees.includes(req.user._id))
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      if (company.subscribers.includes(req.body.userId))
        return res.status(403).json({
          error: 'ALREADY_EXISTS'
        })
      company = await Company.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $push: {
            subscribers: user._id
          }
        },
        {
          new: true
        }
      ).exec()
      return res.json(CompanyResource(company))
    } catch (err) {
      logger.error('Error at CompanyController/subscribe: ', err)
      return res.status(500).end()
    }
  }
  static async unsubscribe(req, res) {
    if (!req.user?.isRecruiter)
      return res.status(403).json({
        error: 'FORBIDDEN'
      })
    if (!req.params?.id || !req.body?.userId)
      return res.status(404).json({
        error: 'MISSING'
      })
    try {
      const user = await User.findById(req.body.userId).exec()
      if (!user)
        return res.status(404).json({
          error: 'NOT_FOUND'
        })
      let company = await Company.findById(req.params.id)
        .populate('employees')
        .populate('subscribers')
        .exec()
      if (!company.employees.includes(req.user._id))
        return res.status(403).json({
          error: 'FORBIDDEN'
        })
      if (!company.subscribers.includes(req.body.userId))
        return res.status(404).json({
          error: 'MISSING'
        })
      company = await Company.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $pull: {
            subscribers: user._id
          }
        },
        {
          new: true
        }
      ).exec()
      return res.json(CompanyResource(company))
    } catch (err) {
      logger.error('Error at CompanyController/unsubscribe: ', err)
      return res.status(500).end()
    }
  }
}
