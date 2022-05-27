<script setup lang="ts">
import InspectorInputBase from './InspectorInputBase.vue'
defineProps<{ label: string; value: number }>()
const emit = defineEmits<{(e: 'input', value: number): void; }>()
function update (e: number) {
  emit('input', e)
}
</script>
<template>
  <inspector-input-base :label="label">
    <v-input v-bind="$attrs" :value="value" @input="update" />
  </inspector-input-base>
</template>
