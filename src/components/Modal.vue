<script setup lang="ts">
defineProps({
  isOpen: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits<{(e: 'update:isOpen', v: boolean): void }>()
</script>

<template>
  <div v-if="isOpen" class="overlay">
    <div class="modal">
      <div class="header">
        <button style="margin-left: auto;" @click="emit('update:isOpen', false)">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              fill="white"
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
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
