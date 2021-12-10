<template>
  <div v-if="image" class="banner pagebanner">
    <div v-if="editable" class="flex text-lg text-white overlay w-80">
      <div class="m-auto">
        <label id="set-avatar" class="cursor-pointer">
          <font-awesome-icon :icon="['fas', 'camera-retro']" />
          <span class="ml-2 underline">{{ $t('buttons.changeImage') }}</span>
        </label>
      </div>
    </div>
    <div
      v-if="image !== 'null'"
      class="banner-image pagebanner-image"
      :style="styles"
    />
    <div
      v-if="image === 'null'"
      class="banner-image pagebanner-image"
      data-twic-background="url(placeholder:auto)"
    />
    <div class="banner-body banner-body-overlap pagebanner-content-box">
      <slot>
        <div class="pagebanner-content">
          <h2 class="banner-title pagebanner-title">{{ title }}</h2>
          <h6 v-if="subtitle" class="pagebanner-subtitle">{{ subtitle }}</h6>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageBanner',
  props: {
    title: {
      type: String,
      default: 'No title'
    },
    image: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    styles() {
      return {
        'background-image': `url('${this.image}')`
      }
    }
  }
}
</script>
