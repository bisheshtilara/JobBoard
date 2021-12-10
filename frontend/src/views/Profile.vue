<template>
  <div class="h-full">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <div v-if="entity">
      <!-- Page Banner -->
      <PageBanner :image="image" class="profile-page-banner-image-height">
        <div class="profile-avatar-section">
          <Avatar
            :username="entity.username"
            :src="avatar"
            :size="124"
            background-color="#4285F4"
            color="#fff"
            class="profile-avatar-image"
            :custom-style="{ font: 'bold 18px Poppins' }"
          />
          <div class="flex flex-col items-center">
            <h3>{{ fullname }}</h3>
            <div class="flex">
              <h4 v-if="isRecruiter" class="text-primary-lightGray">
                {{ entity.company }} No company
              </h4>
            </div>
            <button
              v-if="canSee"
              class="button button-sm button-inverted-gray"
              @click="$router.push('/settings')"
            >
              Edit Profile
            </button>
            <button
              v-if="isAdmin"
              class="button button-sm button-inverted-danger"
              @click="deleteUser(entity._id)"
            >
              Delete profile
            </button>
          </div>
        </div>
      </PageBanner>
      <!-- Show user buttons -->
      <section
        class="relative w-full px-4 lg:w-9/12 lg:px-20 lg:pt-10 flex-column"
      >
        <div class="mb-10 badges-container badges-profile">
          <a
            v-if="entity.resume"
            :href="entity.resume"
            target="blank"
            class="button button-lg button-profile-link cursor-pointer"
          >
            <font-awesome-icon
              :icon="['fas', 'file-pdf']"
              class="icon text-white"
            />
            CV
          </a>
          <a
            v-if="entity.facebook"
            :href="entity.facebook"
            target="blank"
            class="button button-lg button-profile-link cursor-pointerpointer"
          >
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="icon text-white"
            />Facebook
          </a>
          <a
            v-if="entity.github"
            :href="entity.github"
            target="blank"
            class="button button-lg button-profile-link cursor-pointerpointer"
          >
            <font-awesome-icon
              :icon="['fab', 'github']"
              class="icon text-white"
            />Github
          </a>
          <a
            v-if="entity.linkedin"
            :href="entity.linkedin"
            target="blank"
            class="button button-lg button-profile-link cursor-pointerpointer"
          >
            <font-awesome-icon
              :icon="['fab', 'linkedin']"
              class="icon text-white"
            />Linkedin
          </a>
          <a
            v-if="entity.website"
            :href="entity.website"
            target="blank"
            class="button button-lg button-profile-link cursor-pointerpointer"
          >
            <font-awesome-icon
              :icon="['fas', 'globe']"
              class="icon text-white"
            />Website
          </a>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html prettier/prettier -->
        <div class="flex flex-col text-justify richtext profile-bio" v-html="entity.bio || ''" />
      </section>
      <!-- Show recruiter presentation video -->
      <section v-if="isRecruiter" class="px-4 overflow-hidden lg:px-16">
        <!-- Recruiter's Offer List -->
        <OffersList :offers="scheduledRecruitersOffers" recruiter-page>
          <h4>{{ isWatching ? `${fullname}'s` : 'My' }} offers</h4>
        </OffersList>
      </section>
      <section v-else class="px-5 lg:px-16">
        <!-- Upcoming Offers List -->
        <div class="mt-20">
          <OffersList v-if="!isRecruiter && canSee" :offers="userOffers">
            <h3>
              {{ $t('profile.applied') }}
            </h3>
          </OffersList>
        </div>
        <!-- Past Offers List -->
        <div v-if="isRecruiter" class="mt-20">
          <OffersList :offers="pastOffers" past>
            <h4>
              {{ $t('profile.completed') }}
            </h4>
          </OffersList>
        </div>
      </section>
    </div>
    <!-- Error texts -->
    <div v-if="showError">
      <div class="my-56 text-center content-1">
        {{ $t('messages.somethingWrong') }}
        <br />
        {{ $t('messages.tryAgain') }}
      </div>
    </div>
    <!-- Bottom Banner -->
    <BottomBanner version="stayfit" />
  </div>
</template>

<script>
import PageBanner from '@/components/sections/PageBanner'
import BottomBanner from '@/components/sections/BottomBanner'
import isAuthenticated from '@/mixins/isAuthenticated'
import loading from '@/mixins/loading'
import OffersList from '@/components/OffersList'
import { mapGetters } from 'vuex'
import Avatar from 'vue-avatar'
import EventBus from '@/EventBus'

export default {
  name: 'Profile',
  components: {
    PageBanner,
    BottomBanner,
    OffersList,
    Avatar
  },
  mixins: [isAuthenticated, loading],
  data() {
    return {
      foreignUser: null,
      timeout: 60 * 1000,
      timedout: false,
      timer: null,
      isWatching: false,
      adminOffers: []
    }
  },
  computed: {
    ...mapGetters({
      getOffersByRecruiter: 'offers/getOffersByAuthor',
      appliedOffers: 'applications/appliedOffers'
    }),
    isRecruiter() {
      return this.entity?.isRecruiter
    },
    isAdmin() {
      return this.me?.isAdmin
    },
    fullname() {
      return `${this.entity.firstname} ${this.entity.lastname}`
    },
    entity() {
      return this.isWatching ? this.foreignUser : this.me
    },
    avatar() {
      return this.entity?.avatar?.sm || 'https://via.placeholder.com/124'
    },
    showError() {
      return (
        (this.isRecruiter && !this.entity) ||
        (!this.isRecruiter && !this.entity)
      )
    },
    recruiterOffers() {
      if (this.isRecruiter) return this.getOffersByRecruiter(this.entity)
      return null
    },
    userOffers() {
      return this.appliedOffers
    },
    scheduledRecruitersOffers() {
      return this.recruiterOffers.filter((offer) =>
        this.$moment(offer.startDate).isSameOrAfter(this.$moment())
      )
    },
    image() {
      return this.entity.banner?.lg || 'null'
    },
    pastOffers() {
      return this.userOffers.filter((offer) =>
        this.$moment().isSameOrAfter(this.$moment(offer.startDate))
      )
    },
    upcomingOffers() {
      return this.userOffers.filter((offer) =>
        this.$moment().isBefore(this.$moment(offer.startDate))
      )
    },
    canSee() {
      return (
        this.isAdmin || this.me._id.toString() === this.entity._id.toString()
      )
    }
  },
  async beforeMount() {
    if (this.$route.params?.id) {
      EventBus.$emit('loadingStart')
      try {
        this.foreignUser = await this.$store.dispatch(
          'user/findUser',
          this.$route.params.id
        )
        EventBus.$emit('loadingStop')
        this.isWatching = true
      } catch (e) {
        this.isWatching = false
        EventBus.$emit('loadingStop')
        this.$router.push('/users')
      }
    }
    if (this.isAdmin) {
      await this.$store.dispatch(
        'applications/fetchAdminApplications',
        this.entity._id
      )
    }
  },
  methods: {
    deleteUser(userId) {
      this.$swal({
        ...this.swalOptions,
        icon: 'info',
        title: 'Are you sure you want to delete this account?',
        html: '<input id="deleteReason" class="form-input" type="text" placeholder="Let the user know why (optional)" />',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'button button-inverted mr-3',
          cancelButton: 'button button-primary'
        },
        preConfirm: async () => {
          return this.$store
            .dispatch('user/deleteUserById', {
              id: userId,
              reason: document.getElementById('deleteReason')?.value
            })
            .catch((error) => {
              this.handleError(error)
            })
        },
        allowOutsideClick: () => {}
      }).then(async (result) => {
        if (result.value) {
          await this.$swal({
            ...this.swalOptions,
            icon: 'success',
            html: 'Account deleted!'
          })
          this.$router.push('/users')
        }
      })
    }
  }
}
</script>
