import { VFBLoginScope as VFacebookLoginScope } from 'vue-facebook-login-component'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      facebookClientID: 'TODO'
    }
  },
  components: {
    VFacebookLoginScope
  },
  methods: {
    async loginWithFacebook(response) {
      if (!response) {
        return
      }
      if (response?.status !== 'connected') {
        Swal.fire(
          'Oops...',
          'Failed to login with facebook, try again later!',
          'error'
        )
      } else {
        const { authResponse } = response
        this.$emit('close-login-modal')
        this.isLoading = true
        this.$store
          .dispatch('user/loginWithFacebook', authResponse)
          .then(() => {
            this.isLoading = false
          })
      }
    }
  }
}
