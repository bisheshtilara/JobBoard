<template>
  <div class="h-full">
    <nav class="navbar">
      <div class="navbar-container">{{ $t('test') }}</div>
    </nav>
  </div>
</template>

<script>
import EventBus from '@/EventBus'
export default {
  name: 'Home',
  created() {
    this.$nextTick(() => {
      if (this.$route.name === 'register') {
        this.emitGlobalEvent('open-register-modal')
      } else if (this.$route.name === 'login') {
        this.emitGlobalEvent('open-login-modal')
      }
    })
  },
  methods: {
    emitGlobalEvent(event) {
      EventBus.$emit(event)
    }
  },
  head: {
    title: {
      inner: 'Home'
    }
  }
}
</script>
