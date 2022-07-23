<script setup lang="ts">
import { onDragStart } from '../utils/onDragStart'

const props = defineProps<{
  value: number | string
}>()

const emit = defineEmits<{(e: 'input', value: number): void }>()

function pointerdown (e: MouseEvent) {
  onDragStart(e, (delta, e) => {
    if (typeof props.value === 'number') {
      emit('input', props.value + e.movementX)
    }
  })
}
</script>

<template>
  <div style="width: 100%; display: flex">
    <input v-bind="$attrs" :value="value">
  </div>
</template>

<!--

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
            />
          </svg>
        </button>

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
            />
          </svg>
        </button>

 -->
