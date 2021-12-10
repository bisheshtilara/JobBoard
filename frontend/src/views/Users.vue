<template>
  <div class="h-full">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <div v-if="isAdmin">
      <PageBanner
        :image="require('@/assets/images/banners/admin.jpg')"
        :title="title"
      />
      <section class="findOffer-section">
        <h3>{{ $t('usersPage.filter') }}</h3>
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
                <h6 class="mb-4 font-bold text-25 leading-150">User type</h6>
                <selector-h
                  v-model="user_type"
                  class="w-full mb-6 max-h-1/2"
                  :options="['Recruiter']"
                ></selector-h>
              </div>
            </div>
          </div>
          <div class="w-3/4 pl-6">
            <div v-if="renderedUsers.length === 0">
              {{ $t('usersPage.noUsersFound') }}
            </div>
            <div class="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <div
                v-for="user in renderedUsers"
                :key="user._id"
                class="justify-items-center"
              >
                <UserCard :key="user._id" :user="user" class="mb-3" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import loading from '@/mixins/loading'
import isAuthenticated from '@/mixins/isAuthenticated'
import PageBanner from '@/components/sections/PageBanner'
import selectorH from '@/components/forms/selectorH'
import UserCard from '@/components/cards/UserCard'
import { mapState } from 'vuex'

export default {
  name: 'Users',
  components: { PageBanner, selectorH, UserCard },
  mixins: [isAuthenticated, loading],
  data() {
    return {
      title: "Users' profiles",
      user_type: []
    }
  },
  computed: {
    ...mapState(['users']),
    isAdmin() {
      return this.me?.isAdmin
    },
    filteredUsers() {
      return this.applyFilters(this.user.all)
    },
    renderedUsers() {
      if (!this.filteredUsers.length) {
        return []
      }
      return this.filteredUsers
    }
  },
  methods: {
    applyFilters(users) {
      return this.filterByType(
        users.filter((user) => {
          if (!user.isAdmin && !user.deleted) return user
        }),
        this.user_type
      )
    },
    filterByType(users, types) {
      if (!types || types.length === 0) return users
      const isRecruiter = types[0] === 'Recruiter'
      if (!isRecruiter) return users
      return users.filter((user) => user.isRecruiter === isRecruiter)
    }
  }
}
</script>
