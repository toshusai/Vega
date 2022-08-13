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

const emit = defineEmits<{(e: 'update:isOpen', v: boolean): void }>()
</script>

<template>
  <div v-if="isOpen" class="overlay">
    <div class="modal">
      <div class="header">
        <button v-if="showClose" :disabled="!closable" style="margin-left: auto;" @click="emit('update:isOpen', false)">
          <v-icons fill="white" :path="mdiClose" />
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
  padding: 16px;
  background: gray;
}

.header {
  display: flex;
}
</style>
