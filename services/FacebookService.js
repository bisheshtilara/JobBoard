import logger from '@logger'
import FB from 'fb'
import UserService from './UserService'

export default class FacebookService {
  /**
   * Class constructor will receive the injections as parameters.
   */
  constructor(user) {
    this.user = user
  }

  async connect(origin, accessToken, expiresIn, userID) {
    try {
      FB.setAccessToken(accessToken)

      const res = await FB.api('me', {
        fields: 'id,email,picture.width(400).height(400),first_name, last_name'
      })

      if (!res || res.error) {
        logger.error(
          `Error in FacebookService/connect:${
            !res ? 'error occurred' : res.error
          }`,
          res
        )
        return
      }

      const { first_name, last_name, email, picture } = res
      const existingUser =
        this.user || (await UserService.getUserBy('email', email))
      // If it's an existing user
      if (existingUser) {
        // Set/Update token to always have the latest access token
        existingUser.socialAccounts = existingUser?.socialAccounts || {} // Set .socialAccounts if not set
        existingUser.socialAccounts.facebook =
          existingUser?.socialAccounts?.facebook || null // Set .facebook if not set
        existingUser.socialAccounts.facebook = {
          accessToken,
          expiresIn,
          userID
        }
        await existingUser.save()
        this.user = existingUser
      }
      // If it's a new user
      if (!this.user) {
        const newUser = await UserService.registerNotSafe({
          email,
          firstname: first_name,
          lastname: last_name,
          socialAccounts: {
            facebook: {
              accessToken,
              expiresIn,
              userID,
              link: `https://facebook.com/profile.php?id=${userID}`
            }
          },
          avatar: {
            sm: picture?.data?.url,
            lg: picture?.data?.url
          }
        })

        this.user = newUser
      }
    } catch (e) {
      logger.error('Error in FacebookService/connect', e)
    }
  }
}
