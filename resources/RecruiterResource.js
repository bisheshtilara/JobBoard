import Resource from 'resources.js'

export default class RecruiterResource extends Resource {
  toArray() {
    return {
      _id: String(this._id),
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username,
      languages: this.languages,
      facebook: this.socialAccounts?.facebook?.link || null,
      linkedin: this.socialAccounts?.linkedin?.link || null,
      github: this.socialAccounts?.github?.link,
      website: this.website || null,
      gender: this.gender,
      birthday: this.birthday,
      bio: this.bio,
      organization: this.organization,
      lastActive: this.lastActive
    }
  }
}