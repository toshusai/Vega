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
    <div style="display: flex;">
      <v-button v-if="!isRecording" style="margin: auto" @click="emit('start-recording')">
        export
      </v-button>
      <v-button v-else style="margin: auto" @click="emit('stop-recording')">
        cancel
      </v-button>
    </div>
    <div />
  </v-modal>
</template>

<style scoped></style>
