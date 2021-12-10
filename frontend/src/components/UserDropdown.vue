<template>
  <div>
    <div
      class="userdropdown userdropdown-toggler lg:dropdown-link nav-link"
      @click="toggle = !toggle"
    >
      <div class="userdropdown-toggler-avatar">
        <img
          class="object-cover w-full h-full"
          :src="userAvatar"
          alt="profile"
        />
      </div>
      {{ `${me.firstname} ${me.lastname.slice(0, 1).toUpperCase()}.` }}
      <font-awesome-icon
        :icon="['fas', 'chevron-down']"
        size="xs"
        class="ml-2"
      />
    </div>
    <transition
      name="custom-classes-transition"
      enter-class="transform scale-95 opacity-0"
      enter-active-class="transition duration-100 ease-out"
      enter-to-class="transform scale-100 opacity-100"
      leave-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="toggle"
        v-click-outside="clickOutside"
        class="dropdown-menu userdropdown-menu"
        @click="clickOutside"
      >
        <router-link to="/profile" class="dropdown-item">
          <unicon
            name="ticket"
            fill="currentColor"
            width="15"
            height="15"
            class="mr-2"
          />
          Profile
        </router-link>
        <router-link to="/settings" class="dropdown-item">
          <unicon
            name="cog"
            fill="currentColor"
            width="15"
            height="15"
            class="mr-2"
          />
          Settings
        </router-link>
        <router-link to="/contact" class="dropdown-item">
          <unicon
            name="life-ring"
            fill="currentColor"
            width="15"
            height="15"
            class="mr-2"
          />
          Help
        </router-link>
        <span class="dropdown-item" @click="logout()">
          <unicon
            name="sign-out-alt"
            fill="currentColor"
            width="15"
            height="15"
            class="mr-2"
          />
          Log out
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import isAuthenticated from '@/mixins/isAuthenticated'
export default {
  name: 'UserDropdown',
  components: {},
  mixins: [isAuthenticated],
  data() {
    return { toggle: false }
  },
  methods: {
    clickOutside() {
      this.toggle = false
    },
    lOut() {
      this.logout()
      this.toggle = false
    }
  }
}
</script>
