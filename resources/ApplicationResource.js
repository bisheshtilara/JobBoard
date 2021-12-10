import Resource from 'resources.js'
import OfferResource from './OfferResource'
import UserResource from './UserResource'

export default class ApplicationResource extends Resource {
  toArray() {
    return {
      _id: String(this._id),
      user: new UserResource(this.user).exec(),
      offer: new OfferResource(this.offer).exec(),
      deleted: this.deleted || false,
      cancelReason: this.cancelReason,
      isAccepted: this.isAccepted || false,
      isRejected: this.isRejected || false,
      rejectReason: this.rejectReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}