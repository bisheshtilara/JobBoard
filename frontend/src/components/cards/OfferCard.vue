<template>
  <div class="card offerCard h-84" @click="openOffer()">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <!-- Offer Card Head -->
    <div class="offerCard-head h-3/4">
      <div class="offerCard-head-image card-image" :style="styles" />
      <div class="card-badge-transparent-bg">
        <!-- Partner badge -->
        {{ '' }}
      </div>
      <div class="offerCard-title">
        <span>{{ offer.title }}</span>
      </div>
    </div>
    <!-- Offer Card Body  -->
    <div class="offerCard-body h-1/2">
      <div class="flex items-center justify-between flex-1 px-4 py-4">
        <div class="w-8/12 md:w-9/12">
          <h6 class="offerCard-company-title">
            {{ 'Company title' }}
          </h6>
          <h6 class="card-description offerCard-description">
            {{ offer.education }} | {{ offer.time }}
            {{ offer.remote ? `| ${offer.remote}` : '' }}
          </h6>
        </div>
        <div class="badge badge-sm badge-light">
          {{ offer.duration }} {{ offer.duration === 1 ? `month` : `months` }}
        </div>
      </div>
      <div>
        <button
          v-if="!applied && !isAdmin"
          class="
            button button-fluid button-lg button-primary
            offerCard-application-button
            font-montserrat
          "
          @click.stop.prevent="subscribe()"
        >
          Apply
        </button>
        <button
          v-if="!applied && isAdmin"
          class="
            button button-fluid button-lg button-danger
            offerCard-application-button
            font-montserrat
          "
          @click.stop.prevent="deleteOffer()"
        >
          Delete
        </button>
        <button
          v-else-if="applied && !hasFinished"
          class="
            button-fluid button button-lg button-gray
            unsub__button
            font-monserrat
            offerCard-applied-button
          "
          @click.stop.prevent="unsubscribe()"
        >
          <span class="flex-1">Application sent </span>
          <div class="offerCard-applied">
            <unicon
              v-if="applied"
              name="check"
              fill="white"
              class="check-icon offerCard-applied-icon"
              width="20"
              height="20"
            />
          </div>
        </button>
      </div>
    </div>
    <LoginRegisterModal
      v-if="loginRegisterModal"
      @close-loginregister-modal="loginRegisterModal = false"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import isAuthenticated from '@/mixins/isAuthenticated'
import LoginRegisterModal from '@/components/modals/LoginRegister'
import loading from '@/mixins/loading'
import config from '@/helpers/config'
import globalHelper from '@/mixins/globalHelper'

export default {
  name: 'OfferCard',
  components: {
    LoginRegisterModal
  },
  mixins: [isAuthenticated, loading, config, globalHelper],

  props: {
    offer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loginRegisterModal: false,
      meeting: null
    }
  },
  computed: {
    ...mapGetters({
      isAppliedTo: 'applications/isAppliedTo',
      getApplicationByOfferId: 'applications/getByOffersId'
    }),
    isAdmin() {
      return this.me?.isAdmin
    },
    hasFinished() {
      return this.$moment().isSameOrAfter(this.$moment(this.offer.validUntil))
    },
    applied() {
      return this.isAppliedTo(this.offer._id)
    },
    styles() {
      const banner = this.offer?.banner?.sm
      return {
        'background-image': `url(${banner})`
      }
    }
  },
  methods: {
    openOffer() {
      this.$router.push({ name: 'offer', params: { id: this.offer._id } })
    },
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
    async unsubscribe() {
      this.$swal({
        ...this.swalOptions,
        title: 'Are you sure you want to remove this application?',
        html: '<input id="cancelReason" class="form-input" type="text" placeholder="Let the user know why (optional)" />',
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
          let application = this.getApplicationByOfferId(this.offer._id)
          const cancelReason =
            document.getElementById('cancelReason')?.value || 'by Admin'
          try {
            return this.$store.dispatch('applications/unsubscribe', {
              application: application._id,
              reason: cancelReason,
              isAdmin: this.me?.isAdmin ? this.me._id : null
            })
          } catch (error) {
            this.handleError(error)
          }
        },
        allowOutsideClick: () => !this.$swal.isLoading
      }).then(async (result) => {
        if (result.value) {
          await this.$swal({
            ...this.swalOptions,
            title: 'Deleted!',
            text: 'You have been successfully removed this application.',
            icon: 'success',
            customClass: {
              ...this.swalOptions.customClass,
              content: 'text-13',
              confirmButton: 'button button-lg button-primary mr-3',
              cancelButton: 'button button-lg button-primary'
            }
          })
          if (this.me?.isAdmin) this.$router.go()
        }
      })
    },
    async deleteOffer() {
      this.$swal({
        ...this.swalOptions,
        title: 'Are you sure you want to delete this offer?',
        html: '<input id="deleteReason" class="form-input" type="text" placeholder="Let the user know why (optional)" />',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete offer',
        buttonsStyling: false,
        customClass: {
          ...this.swalOptions.customClass,
          content: 'text-13',
          confirmButton: 'button button-lg button-inverted mr-3',
          cancelButton: 'button button-lg button-primary'
        },
        preConfirm: async () => {
          const deleteReason = document.getElementById('deleteReason')?.value
          try {
            return this.$store.dispatch('offers/cancel', {
              id: this.offer._id,
              reason: deleteReason
            })
          } catch (error) {
            this.handleError(error)
          }
        },
        allowOutsideClick: () => !this.$swal.isLoading
      }).then(async (result) => {
        if (result.value) {
          await this.$swal({
            ...this.swalOptions,
            title: 'Deleted!',
            text: 'You have been successfully deleted this offer.',
            icon: 'success',
            customClass: {
              ...this.swalOptions.customClass,
              content: 'text-13',
              confirmButton: 'button button-lg button-primary mr-3',
              cancelButton: 'button button-lg button-primary'
            }
          })
          if (this.me?.isAdmin && window.location.pathname !== '/offers')
            this.$router.go()
        }
      })
    }
  }
}
</script>
<style scoped="scss">
.check-icon {
  background: #4285f4;
  border-radius: 50%;
  margin: 0px 5px;
}
</style>
