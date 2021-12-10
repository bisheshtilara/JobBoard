import Resource from 'resources.js'
import RecruiterResource from './RecruiterResource'

export default class OfferResource extends Resource {
  toArray() {
    return {
      _id: String(this._id),
      title: this.title,
      requirements: this.requirements?.text,
      time: this.requirements?.time,
      remote: this.requirements?.remote,
      education: this.requirements?.education,
      author: this.author?._id
        ? new RecruiterResource(this.author).exec()
        : this.author,
      active: this.active,
      startDate: this.startDate,
      duration: this.duration || 0,
      validUntil: this.validUntil,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      banner: this.banner
    }
  }
}
