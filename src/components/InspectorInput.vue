<script setup lang="ts">
import InspectorInputBase from './InspectorInputBase.vue'
defineProps<{ label: string; value: number }>()
</script>
<template>
  <inspector-input-base :label="label">
    <v-input v-bind="$attrs" :value="value" />
  </inspector-input-base>
</template>
