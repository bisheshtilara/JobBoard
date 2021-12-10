<template>
  <div class="h-full">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <PageBanner
      id="set-banner"
      :image="bannerImage"
      :title="$t('settings.title')"
      class="cursor-pointer"
      editable
    />
    <AvatarCropper
      trigger="#set-banner"
      :cropper-options="{ aspectRatio: 2 }"
      :labels="{ submit: 'Select', cancel: 'Cancel' }"
      :upload-handler="uploadBannerHandler"
    />
    <div class="container pb-20 mx-auto mt-20">
      <div class="settings__body">
        <div v-if="me" class="px-10">
          <div class="resume-buttons">
            <div class="upload-cv">
              <input
                id="resumeUpload"
                type="file"
                accept="application/pdf"
                @change="uploadResumeHandler"
              />
              <label for="resumeUpload">
                <font-awesome-icon
                  :icon="['fas', 'file-pdf']"
                  class="icon text-white"
                />
                Upload CV
              </label>
            </div>
            <a
              v-if="me.resume"
              target="_blank"
              :href="me.resume"
              class="button button-primary mt-2"
              >My resume</a
            >
          </div>
          <div class="lg:w-96 md:w-full">
            <div class="overflow-hidden bg-white rounded-lg shadow-lg">
              <div class="relative">
                <div
                  class="flex bg-center bg-cover avatar h-96 lg:w-96 md:w-full"
                  :style="{
                    'background-image': `url(${avatar})`
                  }"
                />
                <div class="flex text-lg text-white overlay cursor-pointer">
                  <label id="set-avatar" class="w-full cursor-pointer">
                    <font-awesome-icon :icon="['fas', 'camera-retro']" />
                    <span class="ml-2 underline">{{
                      $t('buttons.changeImage')
                    }}</span>
                    <AvatarCropper
                      trigger="#set-avatar"
                      :labels="{ submit: 'Select', cancel: 'Cancel' }"
                      :upload-handler="uploadAvatarHandler"
                    />
                  </label>
                </div>
              </div>
              <div class="flex items-center px-6 py-2 bg-primary-accent">
                <h2 class="text-xl font-semibold text-white uppercase">
                  {{ me.firstname }} {{ me.lastname }}
                </h2>
              </div>
            </div>
          </div>
          <div class="settings__info">
            <div class="overflow-hidden rounded shadow-lg">
              <div class="px-6 py-4">
                <transition name="fade">
                  <div
                    v-show="unsaved"
                    class="
                      flex
                      items-center
                      px-4
                      py-3
                      mb-4
                      text-sm text-white
                      bg-primary-accent
                    "
                    role="alert"
                  >
                    <unicon
                      class="p-1 -mt-2 -mb-2"
                      name="info-circle"
                      fill="currentColor"
                    />

                    <p class="text-sm">{{ $t('messages.unsavedChanges') }}</p>
                  </div>
                </transition>
                <h2
                  class="
                    block
                    pb-4
                    mb-4
                    text-xl
                    font-bold
                    tracking-wide
                    text-black
                    border-b
                  "
                >
                  {{ $t('settings.accountInfo') }}
                </h2>

                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="email"
                    >
                      {{ $t('forms.email') }}
                    </label>
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required|email"
                    >
                      <input
                        id="email"
                        v-model="email"
                        class="form-input"
                        type="email"
                        placeholder
                      />
                      <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </div>
                <ValidationObserver>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="confirmed:confirmation"
                  >
                    <div class="flex flex-wrap mb-3 -mx-3">
                      <div class="w-full px-3">
                        <label
                          class="
                            block
                            p-0
                            text-xs
                            font-bold
                            tracking-wide
                            text-gray-700
                            uppercase
                          "
                          for="password"
                        >
                          {{ $t('forms.password') }}
                        </label>
                        <input
                          id="password"
                          v-model="password"
                          class="form-input"
                          autocomplete="new-password"
                          type="password"
                        />
                        <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p>
                        <p class="mt-2 text-sm text-gray-600">
                          {{ $t('forms.keepOldPassword') }}
                        </p>
                      </div>
                    </div>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" vid="confirmation">
                    <div class="flex flex-wrap mb-3 -mx-3">
                      <div class="w-full px-3">
                        <label
                          class="
                            block
                            p-0
                            text-xs
                            font-bold
                            tracking-wide
                            text-gray-700
                            uppercase
                          "
                          for="confirm-password"
                        >
                          {{ $t('forms.confirmPassword') }}
                        </label>
                        <input
                          id="confirm-password"
                          v-model="password_confirm"
                          class="form-input"
                          autocomplete="new-password"
                          type="password"
                        />
                        <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p>
                      </div>
                    </div>
                  </ValidationProvider>
                </ValidationObserver>
                <div class="flex justify-end">
                  <button
                    class="button button-lg button-primary"
                    @click.prevent="update"
                  >
                    {{ $t('buttons.updateProfile') }}
                  </button>
                </div>
                <h2
                  class="
                    block
                    pb-4
                    mb-4
                    text-xl
                    font-bold
                    tracking-wide
                    text-black
                    border-b
                  "
                >
                  {{ $t('settings.profileInfo') }}
                </h2>
                <p class="pb-2 text-13 text-primary-gray">
                  Optimized aspect ratios are 1:1 for the profile picture and
                  2:1 for the banner.
                </p>
                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3 mb-3 md:w-1/2 md:mb-0">
                    <label
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="first-name"
                    >
                      {{ $t('forms.firstName') }}
                    </label>

                    <ValidationProvider v-slot="{ errors }" rules="required">
                      <input
                        id="first-name"
                        v-model="firstname"
                        class="form-input mt-2"
                        type="text"
                        :placeholder="$t('forms.firstName')"
                      />
                      <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                  <div class="w-full px-3 md:w-1/2">
                    <label
                      class="
                        block
                        p-0
                        mb-2
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="last-name"
                    >
                      {{ $t('forms.lastName') }}
                    </label>
                    <ValidationProvider v-slot="{ errors }" rules="required">
                      <input
                        id="last-name"
                        v-model="lastname"
                        class="form-input"
                        type="text"
                        :placeholder="$t('forms.lastName')"
                      />
                      <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </div>

                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="username"
                    >
                      Username
                    </label>
                    <ValidationProvider v-slot="{ errors }" rules="required">
                      <input
                        id="username"
                        v-model="username"
                        class="form-input"
                        type="text"
                        placeholder="Username"
                      />
                      <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="toggle"
                    >
                      Your status
                    </label>
                    <div class="is-searching bg-primary-accentLighter">
                      <input
                        id="toggle"
                        v-model="isSearching"
                        type="checkbox"
                        class="visually-hidden"
                      />
                      <label for="toggle">{{ $t('settings.searchJob') }}</label>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end">
                  <button
                    class="button button-lg button-primary"
                    @click.prevent="update"
                  >
                    {{ $t('buttons.updateProfile') }}
                  </button>
                </div>
                <h2
                  class="
                    block
                    pb-4
                    mb-4
                    text-xl
                    font-bold
                    tracking-wide
                    text-black
                    border-b
                  "
                >
                  {{ $t('settings.personalInfo') }}
                </h2>

                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="phone"
                    >
                      {{ $t('forms.cellphone') }}
                    </label>
                    <input
                      id="phone"
                      v-model="phone"
                      class="form-input"
                      type="tel"
                      name="phone"
                      placeholder="+32 (0) 123 456 789"
                    />
                  </div>
                </div>
                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="birthday"
                    >
                      {{ $t('forms.birthday') }}
                    </label>
                    <input
                      id="birthday"
                      v-model="birthday"
                      class="form-input"
                      type="date"
                      placeholder
                    />
                  </div>
                </div>
                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                      for="birthday"
                    >
                      {{ $t('forms.gender') }}
                    </label>
                    <select
                      v-model="gender"
                      class="
                        w-full
                        px-6
                        py-4
                        text-sm
                        font-medium
                        text-black
                        rounded-sm
                        bg-primary-accent bg-opacity-10
                      "
                    >
                      <option selected disabled :value="null">
                        {{ $t('forms.gender') }}
                      </option>
                      <option value="female">{{ $t('forms.female') }}</option>
                      <option value="male">{{ $t('forms.male') }}</option>
                      <option value="non-binary">
                        {{ $t('forms.nonBinary') }}
                      </option>
                      <option value="unknown">
                        {{ $t('forms.preferNotSay') }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="flex justify-end">
                  <button
                    class="button button-lg button-primary"
                    @click.prevent="update"
                  >
                    {{ $t('buttons.updateProfile') }}
                  </button>
                </div>
                <div>
                  <p class="delete-account">
                    Do you want to delete your Account?
                  </p>
                  <button class="button button-gray" @click="deleteMyAccount">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageBanner from '@/components/sections/PageBanner'
import isAuthenticated from '@/mixins/isAuthenticated'
import globalHelper from '@/mixins/globalHelper'
import validation from '@/mixins/validation'
import AvatarCropper from 'vue-avatar-cropper'
import loading from '@/mixins/loading'

export default {
  name: 'Settings',
  components: {
    PageBanner,
    AvatarCropper
  },
  mixins: [isAuthenticated, validation, globalHelper, loading],
  data() {
    return {
      unsaved: false,
      image: null,
      imageFile: null,
      banner: null,
      bannerFile: null,
      resume: null,
      resumeFile: undefined,
      password_confirm: null,
      isSearching: false,
      firstname: null,
      lastname: null,
      email: null,
      username: null,
      password: null,
      phone: null,
      birthday: null,
      gender: null
    }
  },
  computed: {
    avatar() {
      return (
        this.image ||
        this.me?.avatar?.lg ||
        require('@/assets/images/avatars/default.png')
      )
    },
    bannerImage() {
      return this.banner || this.me?.banner?.sm || 'null'
    }
  },
  watch: {
    me(newValue) {
      if (newValue) {
        this.copyUserInfo()
      }
    }
  },
  mounted() {
    if (this.me) {
      this.copyUserInfo()
    }
  },
  methods: {
    copyUserInfo() {
      this.phone = this.me.phone || null
      this.username = this.me.username
      this.firstname = this.me.firstname
      this.lastname = this.me.lastname
      this.email = this.me.email
      this.name = this.me.firstname + ' ' + this.me.lastname
      this.birthday = this.$moment(this.me.birthday).format('YYYY-MM-DD')
      this.gender = this.me.gender || null
      this.id = this.me._id
      this.isSearching = this.me.isSearching
    },
    update() {
      // TODO: refactor the following to a for loop
      this.isLoading = true
      const formData = new FormData()
      if (this.password) formData.append('password', this.password)
      if (this.username) formData.append('username', this.username)
      if (this.imageFile) formData.append('avatar', this.imageFile)
      if (this.bannerFile) formData.append('banner', this.bannerFile)
      if (this.resumeFile) formData.append('resume', this.resumeFile)
      if (this.email) formData.append('email', this.email)
      if (this.firstname) formData.append('firstname', this.firstname)
      if (this.lastname) formData.append('lastname', this.lastname)
      if (this.birthday) formData.append('birthday', this.birthday)
      if (this.gender) formData.append('gender', this.gender)
      if (this.phone) formData.append('phone', this.phone)
      formData.append('isSearching', String(this.isSearching))
      this.$store
        .dispatch('user/updateUserInfo', formData)
        .then(() => {
          this.isLoading = false
          this.$swal({
            icon: 'success',
            title: 'Your profile has been updated.'
          }).then(() => this.$router.go())
        })
        .catch((error) => {
          this.isLoading = false
          this.$swal({
            ...this.swalOptions,
            icon: 'error',
            title: 'Something went wrong',
            text: `Error: ${error.response.data.error || 'Not provided'}`
          })
        })
    },
    uploadAvatarHandler(cropped) {
      let croppedImage = cropped.getCroppedCanvas()
      this.image = croppedImage.toDataURL('image/png')
      croppedImage.toBlob((blob) => (this.imageFile = blob))
      this.unsaved = true
    },
    uploadBannerHandler(cropped) {
      let croppedImage = cropped.getCroppedCanvas()
      this.banner = croppedImage.toDataURL('image/png')
      croppedImage.toBlob((blob) => (this.bannerFile = blob))
      this.unsaved = true
    },
    uploadResumeHandler(e) {
      const file = e.target.files[0]
      if (file.type.split('/')[1] !== 'pdf') {
        this.isLoading = false
        this.$swal({
          ...this.swalOptions,
          icon: 'error',
          title: 'Wrong file format',
          text: 'CV should be in PDF format!'
        })
        return
      }
      this.resumeFile = file
      this.unsaved = true
    },
    deleteMyAccount() {
      this.$swal({
        ...this.swalOptions,
        icon: 'info',
        html: 'Are you sure you want to delete your account ?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        buttonsStyling: false,
        customClass: {
          content: 'title-section text-black',
          confirmButton: 'button button-inverted mr-3',
          cancelButton: 'button button-primary'
        },
        preConfirm: async () => {
          try {
            return this.$store.dispatch('user/deleteMyAccount', this.me._id)
          } catch (error) {
            this.handleError(error)
          }
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.$swal({
            ...this.swalOptions,
            icon: 'success',
            html: 'Account Deleted !'
          })
          this.$router.push('/')
        }
      })
    }
  },
  head: {
    title: {
      inner: 'Settings'
    }
  }
}
</script>
