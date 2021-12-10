import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email, confirmed } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'This field is required'
})

extend('email', {
  ...email,
  message: 'This must be a valid email'
})

extend('confirmed', {
  ...confirmed,
  message: 'The two passwords should match!'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  }
}
