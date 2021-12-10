/* eslint-disable */
const levels = {
  1: 'Beginner',
  2: 'Neutral',
  3: 'Beast'
}
const errors = {
  NO_USER: 'No user matching these credentials!',
  NOT_VERIFIED: 'Please verify your email first!',
  INCORRECT: 'These credentials do not match our records.',
  RESET: 'Please reset your password!',
  MISSING: 'Missing fields.',
  BAD_EMAIL: 'Please input a correct email adress',
  ALREADY_EXISTS:
    'A user with this email address already exists. <br> Do you want to login instead ?',
  ALREADY_VERIFIED:
    'A user with this email address already verified. <br> Do you want to login instead ?',
  MISSING_TOKEN: 'Missing token. Try again later or contact founders.',
  BAD_TOKEN: 'Invalid/Expired token. Try again later or contact founders.',
  INVALID_INPUT: 'Invalid value. Try another one.',
  ACCESS_DENIED: 'Access denied! Please log in with corresponding user.'
}

export default {
  data() {
    return {
      swalOptions: {
        buttonsStyling: false,
        customClass: {
          popup: 'swal2-custom-popup',
          confirmButton: 'button button-primary mr-3',
          cancelButton: 'button button-danger '
        }
      }
    }
  },
  computed: {
    authErrors() {
      return errors
    }
  },
  methods: {
    validateEmail(email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return email && re.test(String(email).toLowerCase())
    },
    handleError(error = null) {
      const errorStatus = error?.response?.status
      const errorKey = error?.response?.data?.error
      if (errorStatus <= 422 && errorStatus != 200) {
        if (errorKey in ['ALREADY_EXISTS', 'ALREADY_VERIFIED']) {
          this.$swal({
            ...this.swalOptions,
            icon: 'warning',
            title: 'Oops...',
            showCancelButton: true,
            confirmButtonText: 'Login!',
            html: `${errors[errorKey]}`
          }).then((result) => {
            if (result.value) {
              this.$router.push('/login')
            }
          })
        } else {
          this.$swal({
            ...this.swalOptions,
            icon: 'error',
            title: 'Oops...',
            text: `${errors[errorKey] || 'Not provided'}`
          })
        }
      } else {
        this.$swal({
          ...this.swalOptions,
          icon: 'error',
          title: 'Oops...',
          text: `Something went wrong. ${errorKey || error || 'Not provided'}`
        })
      }
    }
  }
}
