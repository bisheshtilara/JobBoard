<template>
  <div v-if="user" class="userCard cursor-pointer" @click="goToProfile">
    <div class="companyCard-wallpaper" :style="styles" />
    <div class="companyCard-avatar-box">
      <div class="companyCard-avatar">
        <Avatar
          :username="username"
          :src="userAvatar"
          :size="96"
          background-color="#4285F4"
          color="#fff"
          class="mb-4 font-bold text-white"
          :custom-style="{ font: 'bold 18px Poppins' }"
        />
      </div>
    </div>
    <div class="companyCard-content-box">
      <div class="companyCard-name">
        {{ user.firstname + ' ' + user.lastname }}
      </div>
      <div v-if="user.organization" class="companyCard-description">
        {{ user.isRecruiter ? `Works at ` : `Student at ` }}
        {{ user.organization }}
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'

export default {
  name: 'UserCard',
  components: {
    Avatar
  },
  props: {
    display: {
      type: Boolean,
      default: false
    },

    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    userAvatar() {
      return this.user?.avatar?.sm
    },
    username() {
      return (
        this.user?.username ||
        this.user.firstname + ' ' + this.user.lastname ||
        'Unknown'
      )
    },
    image() {
      return this.user?.banner?.sm
    },
    styles() {
      return {
        'background-image': `url(${this.image})`
      }
    }
  },
  methods: {
    goToProfile() {
      this.$router.push(`/profile/${this.user?.username || this.user._id}`)
    }
  }
}
</script>
