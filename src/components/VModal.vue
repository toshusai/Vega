<script setup lang="ts">
import { mdiClose } from '@mdi/js'

defineProps({
  isOpen: {
    default: false,
    type: Boolean
  },
  closable: {
    default: true,
    type: Boolean
  },
  showClose: {
    default: true,
    type: Boolean
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isDown = ref(false)
const up = () => {
  if (isDown.value) {
    emit('close')
  }
  isDown.value = false
}
</script>

<template>
  <div v-if="isOpen" class="overlay" @pointerdown="isDown = true" @pointerup="up">
    <div class="modal" @pointerdown.stop="()=>{}">
      <div class="header">
        <button
          v-if="showClose"
          :disabled="!closable"
          style="margin-left: auto; padding: 0; height: 16px"
          @click="emit('close')"
        >
          <v-icons :size="16" fill="white" :path="mdiClose" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.modal {
  width: 500px;
  padding: 4px;
  padding-bottom: 16px;
  background: gray;
}

.header {
  display: flex;
}
</style>
