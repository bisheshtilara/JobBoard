<template>
  <div class="bottom-banner banner">
    <img
      v-if="version !== 'download'"
      class="bottom-banner-image banner-image"
      :src="image"
    />
    <video
      v-else-if="version === 'download'"
      autoplay
      muted
      loop
      class="bottom-banner-video banner-video"
    >
      <source :src="video" />
    </video>
    <!-- <div class="w-1/5 h-full"></div> -->
    <div class="banner-body banner-body-overlap bottom-banner-content-box">
      <div v-if="version === 'joinnow'">
        <h4 class="banner-title bottom-banner-title">
          {{ $t('bottomBanner.joinnow.sloganTop') }}.<br />
          {{ $t('bottomBanner.joinnow.sloganBottom') }}!
        </h4>
        <button
          class="mr-5 button button-lg button button-lg button-primary"
          @click="emitGlobalEvent('open-register-modal')"
        >
          {{ $t('buttons.createAProfile') }}
        </button>
        <!-- <button
          class="text-xl button button-lg button-primary"
          @click="emitGlobalEvent('open-login-modal')"
        >
          {{ $t('buttons.login') }}
        </button> -->
      </div>
      <div v-else-if="version === 'participate'">
        <h3 class="banner-title bottom-banner-title">
          {{ $t('participate.sloganTop') }}? <br />
          {{ $t('participate.sloganBottom') }}!
        </h3>
        <button
          class="mr-5 button button-lg button-primary"
          @click="emitGlobalEvent('open-register-modal')"
        >
          {{ $t('buttons.createAProfile') }}
        </button>
        <button
          class="button button-lg button-primary"
          @click="emitGlobalEvent('open-login-modal')"
        >
          {{ $t('buttons.login') }}
        </button>
      </div>

      <div v-else-if="version === 'addoffer'">
        <h3 class="banner-title bottom-banner-title">
          {{ $t('bottomBanner.addoffer') }}?
        </h3>
        <button
          class="button button-lg button-primary"
          @click="gotoBetaRecruiterPage(betaRecruiterPagelink)"
        >
          {{ $t('buttons.registerAsRecruiter') }}
        </button>
      </div>

      <div v-else-if="version === 'questions'">
        <h3 class="banner-title bottom-banner-title">
          Got questions? We got the answers
        </h3>
        <p class="bottoom-banner-subtitle">
          Do you need a little assistance? We’ve got your back! Discover our Q&A
          to help you out.
        </p>
        <button
          class="button button-lg button-primary"
          @click="emitGlobalEvent('open-register-modal-recruiter')"
        >
          Contact Us
        </button>
      </div>

      <div v-else>
        <h3 class="banner-title bottom-banner-title">
          {{ $t('hashtag1') }} <br />
          {{ $t('hashtag2') }}
        </h3>
        <button tag="button" class="mr-5 button button-lg button-primary">
          {{ $t('buttons.mission') }}
        </button>

        <button tag="button" class="button button-lg button-primary">
          {{ $t('buttons.meetRecruiters') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/EventBus'

export default {
  name: 'BottomBanner',
  mixins: [],
  props: {
    image: {
      type: String,
      default: () => {
        return require('@/assets/images/banners/bottombanner.jpg')
      }
    },
    version: {
      // Defines which version of the banner to use (stayfit, joinnow, participate, addoffer)
      type: String,
      required: true
    }
  },
  computed: {
    styles() {
      return {
        'background-image': `url('${this.image}')`
      }
    }
  },
  methods: {
    emitGlobalEvent(event) {
      EventBus.$emit(event)
    }
  }
}
</script>
