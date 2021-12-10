<template>
  <div class="modal" @click="$emit('close-login-modal')">
    <div class="modal-dialog reset-modal-dialog" @click.stop>
      <div class="modal-header">
        <div
          class="modal-horizontal-header-image"
          :style="{
            'background-image': `url(${require('@/assets/images/medias/auth.jpg')})`
          }"
        ></div>
        <div class="w-1/5 h-full"></div>
        <div class="modal-horizontal-header-title-box">
          <h5>
            {{ $t('buttons.resetPassword') }}
          </h5>
        </div>
        <font-awesome-icon
          :icon="['fas', 'times']"
          :style="{ color: 'grey' }"
          class="modal-close"
          @click="$emit('close-reset-modal')"
        />
      </div>
      <div class="modal-horizontal-body">
        <div class="xxl:px-12 xxl:py-4">
          <div class="form-group">
            <input
              :value="email"
              type="text"
              :placeholder="$t('forms.email')"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-group">
            <input
              v-model="password"
              type="password"
              :placeholder="$t('forms.password')"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <input
              v-model="password_confirm"
              type="password"
              :placeholder="$t('forms.confirmPassword')"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <button
              class="button button-lg button-primary"
              :disabled="invalidInput"
              @click.prevent="reset"
            >
              {{ $t('buttons.resetPassword') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalHelper from '@/mixins/globalHelper.js'
export default {
  name: 'Reset',
  components: {},
  mixins: [globalHelper],
  props: {
    redirectTo: {
      type: String,
      default: () => '/offers'
    },
    token: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      password: null,
      password_confirm: null,
      forgot: false
    }
  },
  computed: {
    invalidInput() {
      return (
        !this.validateEmail(this.email) ||
        !this.password ||
        !this.password !== !this.password_confirm
      )
    }
  },
  methods: {
    validateEmail(email) {
      /* eslint-disable */
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return email && re.test(String(email).toLowerCase())
    },
    reset() {
      let data = {
        email: this.email,
        password: this.password,
        token: this.token
      }
      this.$store
        .dispatch('user/resetPassword', data)
        .then(() => {
          // Show success message
          this.$emit('open-login-modal')
          this.$swal({
            icon: 'success',
            title: 'Email sent!',
            text: 'Your password has been updated. You can login now!'
          })
        })
        .catch((error) => {
          this.handleError(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  min-height: 167px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.forgot {
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.2px;
  text-decoration-line: underline;

  color: #707070;
}
</style>
