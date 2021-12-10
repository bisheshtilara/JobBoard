<template>
  <div class="avatar-stack-section">
    <div class="w-full" @click="subscribersPopup = true">
      <Avatar
        v-for="(user, i) in users.slice(0, nbAvatar)"
        :key="'avtr-' + user._id"
        :username="user.username"
        :src="getAvatar(user)"
        :size="38"
        background-color="#4285f4"
        color="#fff"
        class="avatar-stack-item-position"
        :style="`margin-left:${i * 25}px`"
        :custom-style="{ font: 'Poppins' }"
      />
      <Avatar
        v-if="users.length > 3"
        :size="38"
        :initials="`+${users.length - 3}`"
        background-color="#4285f4"
        color="#fff"
        class="avatar-stack-item-position"
        :style="`margin-left:${3 * 25}px`"
        :custom-style="{ font: 'Poppins' }"
      />
    </div>
    <Popup v-model="subscribersPopup" class="avatar-stack-popup" @click.stop>
      <div class="container">
        <h4 class="avatar-stack-title">Applicants</h4>
        <div class="avatar-stack-body">
          <div
            v-for="user in users"
            :key="user._id"
            class="avatar-stack-avatar-body"
          >
            <Avatar
              :size="38"
              :src="getAvatar(user)"
              background-color="#4285f4"
              color="#fff"
              class="font-semibold text-white"
            />
            <div class="avatar-stack-name">
              {{
                `${user.firstname} ${
                  me.isRecruiter
                    ? user.lastname
                    : user.lastname.slice(0, 1) + '.'
                }`
              }}
            </div>
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'
import { Popup } from 'vant'
import isAuthenticated from '@/mixins/isAuthenticated'

export default {
  name: 'AvatarStack',
  components: {
    Avatar,
    Popup
  },
  mixins: [isAuthenticated],
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      subscribersPopup: false
    }
  },
  computed: {
    nbAvatar() {
      return Math.min(this.users.length, 3)
    }
  },
  methods: {
    getAvatar(user) {
      return user?.avatar?.sm || require('@/assets/images/avatars/default.png')
    }
  }
}
</script>
