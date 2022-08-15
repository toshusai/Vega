<script setup lang="ts">
defineProps({
  isOpen: {
    default: false,
    type: Boolean
  },
  isRecording: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'start-recording'): void
  (e: 'stop-recording'): void
}>()
</script>

<template>
  <v-modal
    :is-open="isOpen"
    :closable="!isRecording"
    @close="() => emit('close')"
  >
    <button v-if="!isRecording" @click="emit('start-recording')">
      export
    </button>
    <button v-else @click="emit('stop-recording')">
      cancel
    </button>
    <div />
  </v-modal>
</template>

<style scoped></style>
