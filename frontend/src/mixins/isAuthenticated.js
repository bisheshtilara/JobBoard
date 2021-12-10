import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
    isLoggedIn() {
      return !!this.user.current
    },
    userAvatar() {
      return (
        this.me?.avatar?.sm || require('@/assets/images/avatars/default.png')
      )
    },
    me() {
      return this.user.current
    },
    meIsRecruiter() {
      return this.me?.isRecruiter || false
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
    }
  }
}
