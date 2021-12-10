<template>
  <header class="fixed w-full bg-white">
    <div class="px-5 mx-auto xl:px-10">
      <nav class="navbar">
        <router-link class="flex-1 mb-1 md:mr-2" to="/">
          <h5>{{ $t('title') }}</h5>
        </router-link>
        <!-- Login menu buttons -->
        <div v-if="!isLoggedIn" class="navbar-toggler">
          <ul class="flex navbar-nav flex-end">
            <li class="nav-item">
              <a
                class="button button-sm button-dark"
                @click="toggleRegisterModal"
              >
                {{ $t('buttons.register') }}
              </a>
            </li>
            <li class="nav-item nav-item-hidden">
              <a class="nav-link" @click="toggleLoginModal">
                {{ $t('buttons.login') }}
              </a>
            </li>
          </ul>
        </div>
        <!-- Sandwich button -->
        <label for="menu-toggle" class="menu-nav-toggler">
          <font-awesome-icon :icon="['fas', 'bars']" class="text-2xl" />
        </label>
        <input
          id="menu-toggle"
          v-model="displayMenu"
          type="checkbox"
          class="hidden"
        />
        <div id="menu" class="navbar-container">
          <!-- NAVIGATION -->
          <ul class="navbar-nav">
            <li v-if="isAdmin" class="nav-item" @click="displayMenu = false">
              <router-link to="/users">
                {{ $t('navbar.nav.users') }}
              </router-link>
            </li>
            <li class="nav-item" @click="displayMenu = false">
              <router-link to="/offers">{{
                $t('navbar.nav.offers')
              }}</router-link>
            </li>
            <!-- <li class="nav-item" @click="displayMenu = false">
              <router-link to="/companies">
                {{ $t('navbar.nav.company') }}</router-link
              >
            </li> -->
          </ul>
          <!-- <LocaleDropdown /> -->
          <div class="lg:mr-5">
            <!-- USER -->
            <div
              v-if="isLoggedIn"
              class="
                flex flex-row-reverse
                items-center
                justify-between
                w-fulf
                lg:flex-row
              "
              @close-menu="displayMenu = false"
            >
              <UserDropdown class="flex md:flex-row" />
            </div>
            <ul v-if="!isLoggedIn" class="navbar-nav nav-right">
              <li class="nav-item hidden-on-small-screen">
                <a class="nav-link" @click="toggleRegisterModal">
                  {{ $t('buttons.register') }}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="toggleLoginModal">
                  {{ $t('buttons.login') }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <LoginModal
      v-if="loginModal"
      :redirect-to="redirectTo"
      @close-login-modal="loginModal = false"
      @open-register-modal="switchToRegister"
    />
    <ResetModal
      v-if="resetModal && email && token"
      :redirect-to="redirectTo"
      :token="token"
      :email="email"
      @close-reset-modal="resetModal = false"
      @open-login-modal="switchToLogin"
    />
    <RegisterModal
      v-if="registerModal"
      @close-register-modal="registerModal = false"
      @open-login-modal="switchToLogin"
    />
  </header>
</template>

<script>
import EventBus from '@/EventBus'
import isAuthenticated from '@/mixins/isAuthenticated'
import globalHelper from '@/mixins/globalHelper'
import UserDropdown from '@/components/UserDropdown'
import RegisterModal from '@/components/modals/Register'
import LoginModal from '@/components/modals/Login'
import ResetModal from '@/components/modals/Reset'

export default {
  name: 'Header',
  components: {
    RegisterModal,
    LoginModal,
    ResetModal,
    UserDropdown
  },
  mixins: [isAuthenticated, globalHelper],
  data() {
    return {
      displayMenu: false,
      registerModal: false,
      loginModal: false,
      resetModal: false,
      redirectTo: '/offers',
      email: null,
      token: null
    }
  },
  computed: {
    isAdmin() {
      return this.me?.isAdmin
    }
  },
  async created() {
    if (this.$route.params.code) {
      const code = this.$route.params.code
      this.$store
        .dispatch('user/verifyAccount', code)
        .then(() => {
          this.$router.push('/offers')
        })
        .catch((error) => {
          this.handleError(error)
        })
    }
    if (this.$route.params.resetcode) {
      this.token = this.$route.params.resetcode
      this.$store
        .dispatch('user/checkResetToken', this.token)
        .then(({ data }) => {
          this.email = data.email
        })
        .catch((error) => {
          console.error(error)
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: this.authErrors['BAD_TOKEN']
          })
        })
      this.resetModal = true
    }
  },
  mounted() {
    EventBus.$on('open-login-modal', () => {
      this.toggleLoginModal()
    })
    EventBus.$on('open-register-modal', () => {
      this.toggleRegisterModal()
    })
    EventBus.$on('close-register-modal', () => {
      this.toggleRegisterModal()
    })
    if (this.$route.query.redirectFrom) {
      this.redirectTo = this.$route.query.redirectFrom
    }
  },
  methods: {
    toggleLoginModal() {
      this.loginModal = !this.loginModal
      this.displayMenu = false
    },
    toggleRegisterModal() {
      this.registerModal = !this.registerModal
      this.displayMenu = false
    },
    switchToRegister() {
      this.loginModal = false
      this.registerModal = true
    },
    switchToLogin() {
      this.loginModal = true
      this.resetModal = false
      this.registerModal = false
    }
  }
}
</script>
<style lang="scss" scoped>
@media (max-width: 768px) {
  #menu-toggle:checked + #menu {
    display: block;
  }
}

#add-session-button {
  color: white !important;
}
</style>
