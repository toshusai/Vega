<script setup lang="ts">
import InspectorInputBase from './InspectorInputBase.vue'
defineProps<{ label: string; value: string }>()
const emit = defineEmits<{(e: 'input', value: string): void }>()

function input (e:string) {
  emit('input', e)
}
</script>
<template>
  <inspector-input-base :label="label">
    <v-string-input v-bind="$attrs" :value="value" @input="input" />
  </inspector-input-base>
</template>
