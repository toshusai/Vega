<script setup lang="ts">
import InspectorInputBase from './InspectorInputBase.vue'
const props = defineProps<{ label: string; value: string | number }>()
</script>
<template>
  <inspector-input-base :label="label">
    <v-color-input v-bind="$attrs" :value="value" />
  </inspector-input-base>
</template>
