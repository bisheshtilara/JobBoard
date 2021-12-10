import moment from 'moment'
import Resource from 'resources.js'

const defaultBanners = {
  sm: 'https://via.placeholder.com/1920x846',
  lg: 'https://via.placeholder.com/1920x547'
}

export default class UserResource extends Resource {
  toArray() {
    const banner = !this?.banner?.lg ? defaultBanners : this.banner
    return {
      _id: String(this._id),
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username,
      phone: this.phone,
      languages: this.languages,
      exp_edu: this.exp_edu,
      isAdmin: this.isAdmin,
      isRecruiter: this.isRecruiter,
      isSearching: this.isSearching,
      facebook: this.socialAccounts?.facebook?.link,
      linkedin: this.socialAccounts?.linkedin?.link,
      github: this.socialAccounts?.github?.link,
      website: this.website,
      gender: this.gender,
      birthday: this.birthday,
      bio: this.bio,
      organization: this.organization,
      lastActive: this.lastActive,
      deleteReason: this?.deleteReason,
      banner,
      avatar: this.avatar,
      resume: this.resume
    }
  }
}
