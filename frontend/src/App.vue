<template>
  <div id="app" class="h-screen">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <router-view />
  </div>
</template>

<script>
import EventBus from '@/EventBus'
import loading from '@/mixins/loading'

export default {
  name: 'App',
  mixins: [loading],
  created() {
    EventBus.$on('loadingStart', () => {
      this.isLoading = true
    })
    EventBus.$on('loadingStop', () => {
      this.isLoading = false
    })
  },
  mounted() {
    if (this.$route.query.signup === true) {
      this.$swal({
        icon: 'success',
        title: 'Account created',
        text: 'Welcome onboard!'
      })
    }
  },
  methods: {}
}
</script>

<style lang="postcss">
@import 'assets/styles/tailwind.postcss';
</style>
<style lang="scss">
@import 'assets/scss/app.scss';
</style>
