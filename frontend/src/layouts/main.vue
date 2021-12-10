<template>
  <div class="flex flex-col h-full">
    <Header class="z-50" />
    <div class="flex-1">
      <transition>
        <router-view />
      </transition>
    </div>
    <footer></footer>
  </div>
</template>

<script>
import isAuthenticated from '@/mixins/isAuthenticated'
import Header from '@/components/Header'

export default {
  name: 'MainLayout',
  components: { Header },
  mixins: [isAuthenticated],
  async created() {
    await this.$store.dispatch('user/getCurrentUser')
    this.$store.dispatch('offers/fetchAll')
    if (this.me?.isAdmin) await this.$store.dispatch('user/fetchAll')
  }
}
</script>
