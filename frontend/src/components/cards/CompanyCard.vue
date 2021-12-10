<template>
  <div
    v-if="company"
    class="companyCard"
    :class="{
      'h-96': display,
      'h-78': !display
    }"
    @click="goToProfile"
  >
    <div class="companyCard-avatar-box">
      <div class="companyCard-wallpaper" :style="styles" />

      <div class="companyCard-category-badge title-category">
        {{ companyCategory }}
      </div>
      <div class="companyCard-avatar">
        <Avatar
          :username="username"
          :src="companyAvatar"
          :size="96"
          background-color="#4285f4"
          color="#fff"
          class="mb-4 font-bold text-white"
          :custom-style="{ font: 'bold 18px Poppins' }"
        />
      </div>
    </div>
    <div class="companyCard-content-box">
      <div class="companyCard-name">
        {{ company.fullname }}
      </div>
      <div class="companyCard-description">
        {{
          display ? company.intro : `${upcomingOffers.length} upcoming classes`
        }}
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'
import { mapGetters } from 'vuex'

export default {
  name: 'CompanyCard',
  components: {
    Avatar
  },
  props: {
    display: {
      type: Boolean,
      default: false
    },

    company: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getAllOffersByCompany: 'companies/getAllOffersByCompany'
    }),
    companyAvatar() {
      return this.company?.avatar?.sm
    },
    upcomingOffers() {
      return this.getAllOffersByCompany(this.company) || []
    },
    username() {
      return this.company?.title || 'Company name'
    },
    companyCategory() {
      return this.company?.description?.short
    },
    styles() {
      return {
        'background-image': `url(${this.company?.banner?.sm})`
      }
    }
  },
  methods: {
    goToProfile() {
      this.$router.push({
        name: 'companyProfile',
        params: { id: this.company._id }
      })
    }
  }
}
</script>
