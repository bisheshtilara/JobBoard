<template>
  <div class="modal bg-smoke" @click="$emit('close-login-modal')">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <div class="modal-dialog" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header" style="padding-left: 0">
        <div
          class="modal-horizontal-header-image"
          :style="{
            'background-image': `url(${require('@/assets/images/medias/login.jpg')})`
          }"
        ></div>
        <!-- <div class="w-1/5 h-full"></div> -->
        <div class="modal-horizontal-header-title-box">
          <h3 class="modal-horizontal-title">
            {{ forgot ? $t('buttons.forgotPassword') : $t('buttons.login') }}
          </h3>
        </div>
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="modal-close"
          @click="$emit('close-login-modal')"
        />
      </div>
      <!-- End Modal Header -->
      <!-- Modal Body -->
      <div class="modal-horizontal-body">
        <form @submit.prevent="handle">
          <div class="form-group">
            <input
              v-model="email"
              type="text"
              autocomplete="username"
              :placeholder="$t('forms.email')"
              class="form-input"
              :class="missing.email ? 'border border-red-500' : ''"
            />
          </div>
          <div v-if="!forgot" class="form-group">
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              :placeholder="$t('forms.password')"
              class="form-input"
              :class="missing.password ? 'border border-red-500' : ''"
            />
          </div>
          <a v-if="!forgot" class="form-link" @click="forgot = true">
            {{ $t('buttons.forgotPassword') }}
          </a>
          <a v-else class="form-link" @click="forgot = false">
            {{ $t('buttons.rememberPassword') }}
          </a>
          <div class="form-group modal-button-position">
            <button
              class="button button-lg button-primary"
              @click.prevent="handle"
            >
              {{ forgot ? $t('buttons.resetPassword') : $t('buttons.login') }}
            </button>
            <button
              v-if="!forgot"
              class="ml-3 button button-lg button-inverted-primary"
              @click="$emit('open-register-modal')"
            >
              {{ $t('buttons.noAccount') }}
            </button>
          </div>
        </form>
        <div class="grid items-center gap-0 mb-4 sm:grid-cols-3">
          <hr class="hidden mt-3 border-gray-400 sm:block" />
          <span class="text-sm font-normal text-center bg-white">
            Or continue with
          </span>
          <hr class="hidden mt-3 border-gray-400 sm:block" />
        </div>

        <div class="grid items-center">
          <VFacebookLoginScope
            :app-id="facebookClientID"
            class="w-full"
            @login="loginWithFacebook"
          >
            <!-- Compose HTML/CSS here, otherwise nothing will be rendered -->
            <button
              slot-scope="scope"
              type="button"
              class="
                px-4
                py-4
                text-blue-500
                transition
                duration-500
                ease-in-out
                border border-blue-500
                hover:text-white hover:bg-blue-500
              "
              :disabled="scope.disabled"
              @click="scope.login"
            >
              <div v-show="!scope.working" class="mx-auto">
                <font-awesome-icon :icon="['fab', 'facebook']" />
                <span class="ml-2">Login with Facebook</span>
              </div>
              <div v-show="scope.working" class="flex mx-auto">
                <LoadingIcon />
                <span class="ml-2">Connecting to Facebook</span>
              </div>
            </button>
          </VFacebookLoginScope>
        </div>
      </div>
      <!-- End Modal Body -->
    </div>
  </div>
</template>

<script>
import globalHelper from '@/mixins/globalHelper.js'
import loading from '@/mixins/loading'
import socialAuth from '@/mixins/socialAuth'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'

export default {
  name: 'LoginModal',
  components: { LoadingIcon },
  mixins: [globalHelper, loading, socialAuth],
  props: {
    redirectTo: {
      type: String,
      default: () => '/dashboard'
    }
  },
  data() {
    return {
      missing: {
        email: false,
        password: false
      },
      email: null,
      password: null,
      forgot: false
    }
  },
  computed: {},
  methods: {
    handle() {
      if (!this.validateEmail(this.email)) {
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
      this.missing.email = false
      if (!this.forgot) {
        if (!this.password) {
          this.missing.password = true
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
        this.missing.password = false
        this.loginUser()
      } else {
        this.reset()
      }
    },
    reset() {
      this.errors = null
      let data = {
        email: this.email
      }
      this.$store
        .dispatch('user/forgotPassword', data)
        .then(() => {
          this.$emit('close-login-modal')
          this.$swal({
            icon: 'success',
            title: 'Email sent!',
            text: 'Please check your inbox for further instructions!'
          })
        })
        .catch((error) => {
          this.handleError(error)
        })
    },
    loginUser() {
      this.isLoading = true
      this.errors = null
      let data = {
        email: this.email,
        password: this.password
      }
      this.$store
        .dispatch('user/loginUser', data)
        .then(() => {
          this.$emit('close-login-modal')
          this.isLoading = false
          try {
            this.$router.push(this.$route.params.id)
          } catch (error) {
            /* Do nothing for now */
          }
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
.image {
  min-height: 167px;
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>
