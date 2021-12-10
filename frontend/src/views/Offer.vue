<template>
  <div class="h-full">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <div v-if="offer">
      <!-- Page Banner -->
      <PageBanner :image="banner">
        <div class="px-8 py-4 lg:px-16 lg:py-10">
          <h2>{{ offer.title }}</h2>
          <div class="flex items-center">
            <h5 class="mr-6 font-bold leading-100 font-montserrat">
              {{ offer.startDate | moment('DD MMM YYYY') }}
            </h5>
          </div>
          <div class="mt-2">
            <p class="text-primary-lightGray">
              {{ 'Company title' }}
            </p>
            <button
              v-if="isMyOffer"
              class="button button-sm button-inverted-gray"
              @click="$router.push(`/configure/${offer._id}`)"
            >
              Edit offer
            </button>
          </div>
        </div>
      </PageBanner>
      <!-- Main Content -->
      <main class="offer-main-content">
        <!-- Offer details -->
        <div class="badges-container">
          <div class="badge badge-light">
            {{ offer.education }}
          </div>
          <div class="badge badge-light">
            {{ offer.time }}
          </div>
          <div v-if="offer.remote" class="badge badge-light">
            {{ offer.remote }}
          </div>
          <button
            class="flex items-end justify-start px-3 py-3 text-13"
            @click="shareWithFriends"
          >
            <unicon
              name="share-alt"
              fill="#4285F4"
              width="25px"
              height="25px"
            />
          </button>
          <AvatarStack
            v-if="subscribers && subscribers.length > 0"
            class="w-full mt-2"
            :users="subscribers"
          />
        </div>
        <!-- Offer Description -->
        <div
          v-if="offer.description"
          class="py-6 text-description text-primary-gray"
        >
          <span class="text-black text-description"> Description : </span>
          <br />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="richtext" v-html="offer.description" />
        </div>
        <!-- Requirements -->
        <div
          v-if="offer.requirements"
          class="py-6 text-description text-primary-gray"
        >
          <span class="text-black text-description"> Requirements : </span>
          <br />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="richtext" v-html="offer.requirements" />
        </div>
        <!-- Apply an offer section -->
        <div class="flex flex-col justify-end w-full mb-2">
          <button
            v-if="!subscribed && !hasPassed"
            class="mt-10 button-fluid button button-lg button-primary"
            @click.prevent="subscribe"
          >
            <span class="mr-2 font-semibold text-white">
              {{ applyButtonText }}
            </span>
          </button>
        </div>
        <!-- Company details -->
        <CompanyCard :company="company" display class="mt-6" />
        <button
          v-if="subscribed && !hasPassed"
          class="
            mt-4
            button-fluid button button-lg button-gray
            text-13
            unsub__button
          "
          @click="deleteApplication"
        >
          Remove application
        </button>
      </main>
      <!-- Main Content -->
    </div>
    <LoginRegisterModal
      v-if="loginRegisterModal"
      @close-loginregister-modal="loginRegisterModal = false"
    />
  </div>
</template>

<script>
import PageBanner from '@/components/sections/PageBanner'
import isAuthenticated from '@/mixins/isAuthenticated'
import LoginRegisterModal from '@/components/modals/LoginRegister'
import { mapGetters } from 'vuex'
import globalHelper from '@/mixins/globalHelper'
import AvatarStack from '@/components/AvatarStack'
import loading from '@/mixins/loading'
// import CompanyCard from '@/components/cards/CompanyCard'

export default {
  name: 'OfferDetails',
  components: {
    PageBanner,
    AvatarStack,
    // CompanyCard,
    LoginRegisterModal
  },
  mixins: [isAuthenticated, globalHelper, loading],
  props: {
    isRecruiter: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      subscribers: null,
      subscribersCount: 0,
      rating: 4,
      comment: null,
      application: null,
      loginRegisterModal: false
    }
  },
  computed: {
    ...mapGetters({
      getOfferById: 'offers/getOfferById',
      isAppliedTo: 'applications/isAppliedTo',
      getApplicationByOfferId: 'applications/getByOffersId'
    }),
    countdown() {
      return this.$moment(this.offer.start).fromNow(true)
    },
    hasPassed() {
      return this.$moment().isSameOrAfter(this.$moment(this.offer.validUntil))
    },
    trialStatus() {
      return this.me?.inTrial || false
    },
    offer() {
      return this.getOfferById(this.$route.params.id)
    },
    isMyOffer() {
      return this.offer.author._id.toString() === this.me._id.toString()
    },
    banner() {
      return (
        this.offer?.banner?.lg ||
        'https://cdn-images.welcometothejungle.com/XgtpP3wO68drGJ-yxI5c_8728ow2IWXVshE2Aw280Qg/rs:auto:2000::/q:85/czM6Ly93dHRqLXByb2R1Y3Rpb24vdXBsb2Fkcy93ZWJzaXRlX29yZ2FuaXphdGlvbi9jb3Zlcl9pbWFnZS93dHRqX2ZyL2ZyLTI0YWM5MzM2LWE3NTAtNDM1Yy04NmMxLTg5MWFhMjExNDE2Yy5qcGc'
      )
    },
    subscribed() {
      return this.isAppliedTo(this.$route.params.id)
    },
    applyButtonText() {
      if (!this.isLoggedIn) return 'Please log in to apply'
      return `Apply now`
    }
  },
  async beforeMount() {
    if (this.isAppliedTo(this.$route.params.id)) {
      let localApp = this.getApplicationByOfferId(this.$route.params.id)
      if (localApp) {
        this.application = await this.$store.dispatch(
          'applications/getApplication',
          {
            _id: localApp._id
          }
        )
      }
    }
    let { subscribersCount, subscribers } = await this.$store.dispatch(
      'offers/getOfferDetails',
      this.$route.params.id
    )

    this.subscribersCount = subscribersCount
    this.subscribers = subscribers
  },
  methods: {
    async subscribe() {
      this.isLoading = true
      if (!this.isLoggedIn) {
        this.loginRegisterModal = !this.loginRegisterModal
      } else {
        this.$store
          .dispatch('applications/subscribe', {
            offer: this.offer
          })
          .then(() => {
            this.$swal({
              ...this.swalOptions,
              icon: 'success',
              title: 'Application sent!'
            })
          })
          .catch((error) => {
            this.handleError(error)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
      this.isLoading = false
    },
    async deleteApplication() {
      this.$swal({
        ...this.swalOptions,
        title: 'Tell us why you want to remove your application:',
        html:
          '<div class="unsub-sect"><input id="swal-input1" class="swal2-input swal-unsub" type="radio" value="My priorities changed"><label class="lab-unsub">My priorities changed</label></div>' +
          '<div class="unsub-sect"><input id="swal-input2" class="swal2-input swal-unsub" type="radio" value="I am not feeling this company suits me"><label class="lab-unsub">I am not feeling this company suits me</label></div>' +
          '<div class="unsub-sect"><input id="swal-input3" class="swal2-input swal-unsub" type="radio" value="It is too far"><label class="lab-unsub">It is too far</label></div>' +
          '<div class="unsub-sect"><input id="swal-input4" class="swal2-input swal-unsub" type="radio" value="I am no longer interested"><label class="lab-unsub">I am no longer interested</label></div>' +
          '<div><div class="unsub-sect"><input class="swal2-input swal-unsub" type="radio"><label class="lab-unsub">Other</label></div><input id="swal-input5" class="swal2-input swal-unsub-other" type="text"></div>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove application',
        buttonsStyling: false,
        customClass: {
          ...this.swalOptions.customClass,
          content: 'text-13',
          confirmButton: 'button button-lg button-inverted mr-3',
          cancelButton: 'button button-lg button-primary'
        },
        preConfirm: async () => {
          let application = this.getApplicationByOfferId(this.$route.params.id)
          let cancelReason = ''
          if (document.getElementById('swal-input1').checked) {
            cancelReason = document.getElementById('swal-input1').value
          } else if (document.getElementById('swal-input2').checked) {
            cancelReason = document.getElementById('swal-input2').value
          } else if (document.getElementById('swal-input3').checked) {
            cancelReason = document.getElementById('swal-input3').value
          } else if (document.getElementById('swal-input4').checked) {
            cancelReason = document.getElementById('swal-input4').value
          } else if (document.getElementById('swal-input5').value != '') {
            cancelReason = document.getElementById('swal-input5').value
          }
          try {
            return this.$store.dispatch('applications/unsubscribe', {
              application: application._id,
              reason: cancelReason
            })
          } catch (error) {
            this.handleError(error)
          }
        },
        allowOutsideClick: () => !this.$swal.isLoading
      }).then((result) => {
        if (result.value) {
          this.$swal({
            ...this.swalOptions,
            title: 'Deleted!',
            text: 'You have been successfully removed your application.',
            icon: 'success',
            customClass: {
              ...this.swalOptions.customClass,
              content: 'text-13',
              confirmButton: 'button button-lg button-primary mr-3',
              cancelButton: 'button button-lg button-primary'
            }
          })
        }
      })
    },
    async shareWithFriends() {
      navigator.clipboard
        .writeText(location.host + this.$route.fullPath)
        .then(() => {
          this.$swal({
            ...this.swalOptions,
            title: 'Share with your friends',
            text: 'The link to this offer is copied to your clipboard. You can share it with friends to invite them to apply also!',
            confirmButtonText: 'Thanks!'
          })
        })
    }
  }
}
</script>
