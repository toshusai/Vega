<script setup lang="ts">
import InspectorInputBase from './InspectorInputBase.vue'

defineProps<{ label: string; value: number; keyFrame?: boolean }>()

const emit = defineEmits<{
  (e: 'input', value: number): void
  (e: 'key-frame'): void
}>()

function update (e: number) {
  emit('input', e)
}
</script>
<template>
  <inspector-input-base :label="label">
    <div style="display: flex; width: 100%">
      <v-input v-bind="$attrs" :value="value" @input="update" />
      <svg viewBox="0 0 24 24" class="icon" @click="emit('key-frame')">
        <path
          v-if="!keyFrame"
          fill="currentColor"
          d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
        />
        <path
          v-else
          fill="orange"
          d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
        />
      </svg>
    </div>
  </inspector-input-base>
</template>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
  margin: auto;
  cursor: pointer;
  user-select: none;
}
</style>
