import Resource from 'resources.js'

export default class CompanyResource extends Resource {
  toArray() {
    return {
      _id: String(this._id),
      title: this.title,
      description: this.description,
      size: this.size,
      nWorkers: this.nWorkers,
      yearCreated: this.yearCreated,
      address: this.address,
      recruitAreas: this.recruitAreas,
      isPartner: this.isPartner,
      subscribers: this.subscribers
    }
  }
}
