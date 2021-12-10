<template>
  <div class="h-full">
    <div>
      <PageBanner
        :image="require('@/assets/images/banners/jobseek.jpg')"
        :title="title"
      />
      <section class="findOffer-section">
        <div class="findOffer-subtitle">
          <h3>{{ $t('offersPage.subtitle') }}</h3>
          <button
            v-if="me.isRecruiter"
            class="button button-primary"
            @click="$router.push('/configure')"
          >
            New offer
          </button>
        </div>
        <div class="flex mt-5">
          <div class="w-1/4 hidden-on-small-screen">
            <div class="relative flex flex-col h-full pb-5">
              <div
                class="
                  px-0
                  pt-2
                  lg:pr-6 lg:pl-6 lg:-ml-6
                  bg-primary-lighterGray
                "
              >
                <h6 class="mt-2 mb-4 font-bold text-25 leading-150">
                  {{ $t('offersPage.calendarTitle') }}
                </h6>
                <p class="text-10">
                  {{ $t('offersPage.calendarSubtitle') }}
                </p>
                <CalendarComponent
                  :calendar-data.sync="calendarData"
                  class="my-5"
                  minimal
                />
                <h6 class="mb-4 font-bold text-25 leading-150">
                  {{ $t('offersPage.duration') }}
                </h6>
                <selector-h
                  v-model="duration"
                  class="w-full mb-6 max-h-1/2"
                  :options="['3-6 months', '6-12 months', '12+ months']"
                ></selector-h>
                <h6 class="mb-4 font-bold text-25 leading-150">
                  Employment type
                </h6>
                <selector-h
                  v-model="emp_type"
                  class="w-full mb-6 max-h-1/2"
                  :options="['Full-time', 'Part-time']"
                ></selector-h>
              </div>
            </div>
          </div>
          <div class="w-3/4 pl-6">
            <div v-if="renderedOffers.length === 0">
              {{ $t('offersPage.noOffersFound') }}
            </div>
            <div v-for="offer in renderedOffers" :key="offer[0]">
              <h5>{{ $moment(offer[0]).format('DD MMMM YYYY') }}</h5>
              <div class="grid grid-cols-2 gap-2 lg:grid-cols-3">
                <OfferCard
                  v-for="item in offer[1]"
                  :key="item._id"
                  :offer="item"
                  class="mb-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import isAuthenticated from '@/mixins/isAuthenticated'
import PageBanner from '@/components/sections/PageBanner'
import CalendarComponent from '@/components/CalendarComponent'
import OfferCard from '@/components/cards/OfferCard'
import selectorH from '@/components/forms/selectorH'
import { mapState } from 'vuex'
import EventBus from '@/EventBus'

export default {
  name: 'Offers',
  components: {
    PageBanner,
    CalendarComponent,
    selectorH,
    OfferCard
  },
  mixins: [isAuthenticated],
  data() {
    return {
      title: this.$t('offersPage.title'),
      duration: [],
      emp_type: [],
      calendarData: {
        view: 'month',
        selectedDate: this.$moment()
      }
    }
  },
  computed: {
    ...mapState(['offers', 'filter']),
    filteredOffers() {
      return this.applyFilters(this.offers.available)
    },
    renderedOffers() {
      if (!this.filteredOffers.length) {
        return []
      }
      const groupedOffers = this.filteredOffers.reduce((grouped, offer) => {
        const key = this.$moment(offer.startDate).startOf('day').format()
        grouped[key] = grouped[key] || []
        grouped[key].push(offer)
        return grouped
      }, {})
      return Object.entries(groupedOffers)
    }
  },
  methods: {
    emitGlobalEvent(event) {
      EventBus.$emit(event)
    },
    applyFilters(offers) {
      return this.filterByType(
        this.filterByDuration(
          this.filterByDate(offers, this.calendarData.selectedDate),
          this.duration
        ),
        this.emp_type
      )
    },
    filterByType(offers, types) {
      if (!types || types.length === 0) {
        return offers
      }
      return offers.filter((offer) => types.includes(offer.time))
    },
    filterByDate(offers, date) {
      return offers.filter((offer) =>
        this.$moment(offer.startDate).isSameOrAfter(date)
      )
    },
    filterByDuration(offers, durationRanges) {
      if (!durationRanges || durationRanges.length === 0) {
        return offers
      }
      let result = []
      for (let durationRange of durationRanges) {
        let range = []
        switch (durationRange) {
          case '3-6 months':
            range = [3, 6]
            break
          case '6-12 months':
            range = [6, 12]
            break
          case '12+ months':
            range = [12, 999]
            break
        }
        result.push(
          ...offers.filter(
            (offer) => offer.duration >= range[0] && offer.duration <= range[1]
          )
        )
      }
      return result
    }
  },
  head: {
    title: {
      inner: 'Job offers'
    }
  }
}
</script>
