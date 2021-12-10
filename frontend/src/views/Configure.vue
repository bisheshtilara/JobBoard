<template>
  <div v-if="me.isAdmin || me.isRecruiter" class="h-full">
    <Loading :active.sync="isLoading" color="#4285F4" :is-full-page="true" />
    <PageBanner
      id="set-banner"
      :image="bannerImage"
      class="cursor-pointer"
      editable
    >
      <div class="px-8 py-4 lg:px-16 lg:py-10">
        <h2>{{ offerTitle }}</h2>
        <div class="mt-2">
          <button
            v-if="(isMyOffer || me.isAdmin) && offer"
            class="button button-sm button-inverted-danger"
            @click.stop.prevent="deleteOffer()"
          >
            Delete offer
          </button>
        </div>
      </div>
    </PageBanner>
    <AvatarCropper
      trigger="#set-banner"
      :cropper-options="{ aspectRatio: 2 }"
      :labels="{ submit: 'Select', cancel: 'Cancel' }"
      :upload-handler="uploadBannerHandler"
    />
    <div class="container pb-20 mx-auto mt-20">
      <div class="settings__body">
        <div class="px-10">
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
                  {{ $t('configure.offerInfo') }}
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
                      for="offer-title"
                    >
                      {{ 'Title' }}
                    </label>

                    <input
                      id="offer-title"
                      v-model="title"
                      class="form-input"
                      type="text"
                      placeholder
                    />
                    <!-- <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p> -->
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
                      for="offer-requirements"
                    >
                      {{ 'Requirements' }}
                    </label>
                    <VueEditor
                      id="offer-requirements"
                      v-model="requirements"
                      class="form-input"
                      rows="10"
                      :editor-toolbar="customVueEditor"
                    ></VueEditor>
                    <!-- <p class="mt-2 text-sm text-red-600">{{ errors[0] }}</p> -->
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
                      for="offer-remote"
                    >
                      Remote possibility
                    </label>
                    <div class="is-searching bg-primary-accentLighter">
                      <input
                        id="offer-remote"
                        v-model="isRemote"
                        type="checkbox"
                        class="visually-hidden"
                      />
                      <label for="offer-remote">{{ 'Possible remote' }}</label>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      for="offer-time"
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                    >
                      Employment time
                    </label>
                    <selector-h
                      v-model="time"
                      class="w-full mb-6"
                      :options="['Full-time', 'Part-time']"
                      :custom-style="'grid grid-cols-2 gap-3'"
                      single
                    ></selector-h>
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
                      for="offer-education"
                    >
                      {{ 'Education level' }}
                    </label>
                    <select
                      id="offer-education"
                      v-model="education"
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
                      <option selected disabled :value="null">Select</option>
                      <option value="BAC">BAC</option>
                      <option value="BAC+1">BAC+1</option>
                      <option value="BAC+2">BAC+2</option>
                      <option value="BAC+3">BAC+3</option>
                      <option value="BAC+4">BAC+4</option>
                      <option value="BAC+5">BAC+5</option>
                    </select>
                  </div>
                </div>
                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      for="offer-start"
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                    >
                      Start date
                    </label>
                    <input
                      id="offer-start"
                      v-model="startDate"
                      type="date"
                      class="form-input"
                      placeholder
                    />
                  </div>
                </div>
                <div class="flex flex-wrap mb-3 -mx-3">
                  <div class="w-full px-3">
                    <label
                      for="offer-valid"
                      class="
                        block
                        p-0
                        text-xs
                        font-bold
                        tracking-wide
                        text-gray-700
                        uppercase
                      "
                    >
                      Valid until
                    </label>
                    <input
                      id="offer-valid"
                      v-model="validUntil"
                      type="date"
                      class="form-input"
                      placeholder
                    />
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
import selectorH from '@/components/forms/selectorH'
import { VueEditor } from 'vue2-editor'
import { convertJsonToFormData } from '@/helpers/formdata'

export default {
  name: 'ConfigureOffer',
  components: {
    PageBanner,
    AvatarCropper,
    selectorH,
    VueEditor
  },
  mixins: [isAuthenticated, globalHelper, validation, loading],
  data() {
    return {
      offer: null,
      unsaved: false,
      banner: null,
      bannerFile: null,
      title: null,
      requirements: null,
      isRemote: null,
      time: ['Full-time'],
      education: null,
      startDate: null,
      validUntil: null,
      duration: 0,
      customVueEditor: [
        [
          {
            header: [false, 1, 2, 3, 4, 5, 6]
          }
        ],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [
          {
            align: ''
          },
          {
            align: 'center'
          },
          {
            align: 'right'
          },
          {
            align: 'justify'
          }
        ],
        ['blockquote'],
        [
          {
            list: 'ordered'
          },
          {
            list: 'bullet'
          },
          {
            list: 'check'
          }
        ],
        [
          {
            indent: '-1'
          },
          {
            indent: '+1'
          }
        ], // outdent/indent
        [
          {
            color: []
          },
          {
            background: []
          }
        ], // dropdown with defaults from theme
        ['link'],
        ['clean'] // remove formatting button
      ]
    }
  },
  computed: {
    bannerImage() {
      return this.banner || this.offer?.banner?.sm || 'null'
    },
    isMyOffer() {
      return this?.offer?.author?._id === this.me._id
    },
    offerTitle() {
      return this?.offer?.title || 'New offer'
    }
  },
  watch: {
    offer(newValue) {
      if (newValue) {
        this.copyOfferInfo()
      }
    }
  },
  async beforeMount() {
    if (this.$route.params.id) {
      const { offer } = await this.$store.dispatch(
        'offers/getOfferDetails',
        this.$route.params.id
      )
      this.offer = offer
      this.copyOfferInfo()
    }
  },
  methods: {
    copyOfferInfo() {
      this.title = this.offer.title
      this.duration = this.offer.duration
      this.startDate = this.$moment(this.offer.startDate).format('YYYY-MM-DD')
      this.validUntil = this.$moment(this.offer.validUntil).format('YYYY-MM-DD')
      this.requirements = this.offer.requirements.text
      this.time = [this.offer.requirements.time]
      this.isRemote = this.offer.requirements.remote === 'Remote'
      this.education = this.offer.requirements.education
    },
    async update() {
      this.isLoading = true
      const data = {
        title: this.title,
        banner: this.bannerFile,
        duration: this.duration,
        startDate: this.startDate,
        validUntil: this.validUntil
      }
      const formData = convertJsonToFormData(data)
      formData.append('requirements[text]', this.requirements)
      formData.append('requirements[time]', this.time[0])
      formData.append('requirements[remote]', this.isRemote ? 'Remote' : '')
      formData.append('requirements[education]', this.education)
      const link = !this.offer ? 'offers/createOffer' : 'offers/updateOffer'
      const successTitle = !this.offer
        ? 'New offer created'
        : 'Update successful'
      try {
        await this.$store.dispatch(link, {
          data: formData,
          id: this.offer?._id
        })
        this.isLoading = false
        this.$swal({
          icon: 'success',
          title: successTitle
        })
      } catch (err) {
        this.isLoading = false
        this.$swal({
          ...this.swalOptions,
          icon: 'error',
          title: 'Something went wrong',
          text: `Error: ${err.response.data.error || 'Not provided'}`
        })
      }
    },
    uploadBannerHandler(cropped) {
      let croppedImage = cropped.getCroppedCanvas()
      this.banner = croppedImage.toDataURL('image/png')
      croppedImage.toBlob((blob) => (this.bannerFile = blob))
      this.unsaved = true
    },
    async deleteOffer() {
      this.$swal({
        ...this.swalOptions,
        title: 'Are you sure you want to delete this offer?',
        html: '<input id="deleteReason" class="form-input" type="text" placeholder="Let the user know why (optional)" />',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete offer',
        buttonsStyling: false,
        customClass: {
          ...this.swalOptions.customClass,
          content: 'text-13',
          confirmButton: 'button button-lg button-inverted mr-3',
          cancelButton: 'button button-lg button-primary'
        },
        preConfirm: async () => {
          const deleteReason = document.getElementById('deleteReason')?.value
          try {
            return this.$store.dispatch('offers/cancel', {
              id: this.offer._id,
              reason: deleteReason
            })
          } catch (error) {
            this.handleError(error)
          }
        },
        allowOutsideClick: () => !this.$swal.isLoading
      }).then(async (result) => {
        if (result.value) {
          await this.$swal({
            ...this.swalOptions,
            title: 'Deleted!',
            text: 'You have been successfully deleted this offer.',
            icon: 'success',
            customClass: {
              ...this.swalOptions.customClass,
              content: 'text-13',
              confirmButton: 'button button-lg button-primary mr-3',
              cancelButton: 'button button-lg button-primary'
            }
          })
          if (this.me?.isAdmin && window.location.pathname !== '/offers')
            this.$router.go()
        }
      })
    }
  }
}
</script>
