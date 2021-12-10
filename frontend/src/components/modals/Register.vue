<template>
  <div class="register-modal bg-smoke" @click="$emit('close-register-modal')">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <div
      class="
        m-auto
        overflow-hidden
        bg-white
        modal-dialog
        register-width
        xl:w-8/12
        xxl:w-5/12
        xxxl:w-5/12
        md:w-10/12
      "
      @click.stop
    >
      <div class="form-align">
        <div
          class="img-register-div xl:w-1/2 image"
          :style="{
            'background-image': `url(${require('@/assets/images/medias/auth.jpg')})`
          }"
        >
          <h5 class="register-title">
            {{ $t('buttons.register') }}
          </h5>
        </div>
        <div class="register-form xl:w-1/2">
          <div class="register-form-spacing lg:px-12">
            <div class="register-form-scrollable pr-0">
              <p class="my-4 text-sm title">{{ $t('modals.whyRegister') }}</p>
              <form @submit="checkForm">
                <div class="mt-3 xl:mt-5">
                  <input
                    v-model="newUser.firstname"
                    type="text"
                    :placeholder="$t('forms.firstName')"
                    class="form-input"
                    :class="missing.firstname ? 'border border-red-500' : ''"
                  />
                </div>
                <div class="mt-3 xl:mt-5">
                  <input
                    v-model="newUser.lastname"
                    type="text"
                    :placeholder="$t('forms.lastName')"
                    class="form-input"
                    :class="missing.lastname ? 'border border-red-500' : ''"
                  />
                </div>
                <div class="mt-3 xl:mt-5">
                  <input
                    v-model="newUser.email"
                    autocomplete="username"
                    type="text"
                    :placeholder="$t('forms.email')"
                    class="form-input"
                    :class="missing.email ? 'border border-red-500' : ''"
                  />
                </div>
                <div class="mt-3 xl:mt-5">
                  <input
                    v-model="newUser.password"
                    type="password"
                    autocomplete="new-password"
                    :placeholder="$t('forms.password')"
                    class="form-input"
                    :class="[
                      missing.password ? 'border border-grey-500' : '',
                      passwordMatch && newUser.password
                        ? 'border border-green-500'
                        : ''
                    ]"
                  />
                </div>
                <div class="mt-3 xl:mt-5">
                  <span
                    v-if="!passwordMatch"
                    class="text-sm font-semibold text-grey-500"
                    >{{ $t('forms.noMatch') }}</span
                  >
                  <input
                    v-model="newUser.password_confirm"
                    type="password"
                    autocomplete="new-password"
                    :placeholder="$t('forms.confirmPassword')"
                    class="form-input"
                    :class="
                      passwordMatch && newUser.password
                        ? 'border border-green-500'
                        : ''
                    "
                  />
                </div>
              </form>
              <div class="mt-3 xl:mt-10 tos">
                {{ $t('messages.agreeWithOur') }}
                <a :href="'./static/privacypolicy.pdf'" target="_blank">
                  {{ $t('buttons.privacyPolicy') }}
                </a>
                &amp;
                <a :href="'./static/terms.pdf'" target="_blank">
                  {{ $t('buttons.termsAndConditions') }}
                </a>
              </div>
              <div class="py-3">
                <button
                  class="button button-lg button-registration"
                  :disabled="!newUser.password || !passwordMatch"
                  @click.prevent="register"
                >
                  {{ $t('buttons.createAccount') }}
                </button>
              </div>
              <div class="login" @click="$emit('open-login-modal')">
                {{ $t('buttons.yesAccount') }}
              </div>
            </div>
          </div>
        </div>
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="close-register-icon"
          @click="$emit('close-register-modal')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import globalHelper from '@/mixins/globalHelper.js'
import loading from '@/mixins/loading'

export default {
  name: 'Register',
  mixins: [globalHelper, loading],
  data() {
    return {
      missing: {
        firstname: false,
        lastname: false,
        email: false,
        password: false
      },
      newUser: {
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        password_confirm: null
      },
      userBox: false
    }
  },
  computed: {
    passwordMatch() {
      return this.newUser.password === this.newUser.password_confirm
    },
    styles() {
      return {
        'padding-right': '5rem '
      }
    },
    utm() {
      let params = {}
      window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
          params[key] = value
        }
      )
      const obj = {
        url: window.location.href,
        utm_source: params['utm_source'] || '',
        utm_medium: params['utm_medium'] || '',
        utm_campaign: params['utm_campaign'] || '',
        utm_term: params['utm_term'] || '',
        utm_content: params['utm_content'] || ''
      }
      return obj
    }
  },
  methods: {
    checkForm() {
      if (
        this.newUser.firstname &&
        this.newUser.lastname &&
        this.newUser.password
      ) {
        return true
      }
      this.missing.firstname = !this.newUser.firstname
      this.missing.lastname = !this.newUser.lastname
      this.missing.password = !this.newUser.password
      return false
    },
    register() {
      this.isLoading = true
      if (!this.checkForm()) {
        this.handleError({
          response: {
            status: 422,
            data: {
              error: 'MISSING'
            }
          }
        })
        return
      }
      if (!this.validateEmail(this.newUser.email)) {
        this.missing.email = true
        this.handleError({
          response: {
            status: 422,
            data: {
              error: 'BAD_EMAIL'
            }
          }
        })
        return
      }
      const data = {
        firstname: this.newUser.firstname,
        lastname: this.newUser.lastname,
        email: this.newUser.email,
        password: this.newUser.password,
        utm: this.utm
      }
      this.$store
        .dispatch('user/registerNewUser', data)
        .then(() => {
          this.isLoading = false
          this.$emit('close-register-modal')
          window.location = window.location.href + '?signup=true'
        })
        .catch((error) => {
          this.isLoading = false
          this.handleError(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_variables';
.tos {
  font-weight: 400;
  font-size: 10px;
  color: $primary-gray;
  line-height: 20px;
  margin-top: 1rem;
  a {
    color: $primary-color;
    letter-spacing: 0.2px;
    text-decoration-line: underline;
  }
}
.image {
  min-height: 167px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.login {
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.2px;
  text-decoration-line: underline;
  color: $primary-gray;
}
</style>
<style lang="scss">
@import '@/assets/scss/abstracts/_variables';

.vue-tags-input {
  max-width: 100% !important;
  .ti-new-tag-input {
    width: 100%;
    background-color: #f2edff;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }

  .ti-input {
    width: 100%;
    transition: border-bottom 200ms ease;
    background-color: #f2edff;
    height: 44px !important;
    padding-left: 1.2rem;
  }

  &.ti-focus .ti-input {
    border: none;
  }

  .ti-item.ti-selected-item {
    background: $primary-color;
    color: #fff;
  }

  ::-webkit-input-placeholder,
  ::-moz-placeholder,
  :-ms-input-placeholder,
  :-moz-placeholder {
    color: #a4b1b6;
  }

  .ti-tag {
    position: relative;
    background: $primary-color;
    color: #fff;
  }
}
</style>
