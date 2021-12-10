<template>
  <div class="modal bg-smoke" @click="$emit('close-loginregister-modal')">
    <div class="modal-dialog" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <div
          class="modal-horizontal-header-image"
          :style="{
            'background-image': `url(${require('@/assets/images/medias/unsurestudent.jpg')})`
          }"
        ></div>
        <font-awesome-icon
          :icon="['fas', 'times']"
          :style="{ color: 'grey' }"
          class="modal-close"
          @click="$emit('close-loginregister-modal')"
        />
      </div>
      <!-- End Modal Header -->
      <!-- Modal Body -->
      <div class="modal-horizontal-body">
        <div class="flex flex-col mt-6">
          <button
            class="button-lg button-primary"
            @click="
              emitGlobalEvent('open-register-modal')
              $emit('close-loginregister-modal')
            "
          >
            {{ $t('buttons.createAccount') }}
          </button>
          <button
            class="button-lg button-inverted mt-4"
            @click="
              emitGlobalEvent('open-login-modal')
              $emit('close-loginregister-modal')
            "
          >
            {{ $t('buttons.login') }}
          </button>
        </div>
      </div>
      <!-- End Modal Body -->
    </div>
  </div>
</template>

<script>
import EventBus from '@/EventBus'
export default {
  name: 'Register',
  methods: {
    emitGlobalEvent(event) {
      EventBus.$emit(event)
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  min-height: 167px;
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>
