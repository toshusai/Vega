<script setup lang="ts">
import { onDragStart } from '../utils/onDragStart'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{(e: 'input', value: string): void }>()

function input (e:Event) {
  const el = e.target as HTMLInputElement
  emit('input', el.value)
}
</script>

<template>
  <div style="width: 100%; display: flex">
    <input v-bind="$attrs" :value="value" @input="input">
  </div>
</template>
