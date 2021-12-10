<template>
  <div class="mt-10">
    <slot>
      <h4>
        {{ $tc('messages.numberOfOffers', filteredOffers.length) }}
      </h4>
    </slot>
    <div v-if="filteredOffers.length > 0">
      <div class="offers-cards-grid">
        <OfferCard
          v-for="offer in filteredOffers"
          :key="offer._id"
          :offer="offer"
        />
      </div>
    </div>
    <div v-else class="flex w-full">
      <p v-if="recruiterPage" class="mt-5 lg:m-auto lg:text-3xl">
        {{ $t('messages.oopsNoRecruiters') }}
      </p>
      <p v-else class="mt-5 lg:m-auto lg:text-3xl">
        {{ $t('messages.oopsNoOffers') }}
      </p>
    </div>
  </div>
</template>

<script>
import OfferCard from '@/components/cards/OfferCard'

export default {
  name: 'OffersList',
  components: {
    OfferCard
  },
  mixins: [],
  props: {
    offers: {
      type: Array,
      required: true
    },
    recruiterPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayedOffers() {
      return this.offers
    },
    filteredOffers() {
      return this.displayedOffers
    }
  }
}
</script>

<style lang="scss">
.calendarStyle {
  .cell.day:not(.blank) {
    &.selected {
      background: #2d69f4 !important;
      color: white;
    }
    &:hover:not(.disabled) {
      border-color: #4285f4 !important;
    }
  }
}
</style>
