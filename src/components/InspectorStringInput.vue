<script setup lang="ts">
import InspectorInputBase from "./InspectorInputBase.vue";
defineProps<{ label: string; value: string }>();
</script>
<template>
  <inspector-input-base :label="label">
    <v-string-input v-bind="$attrs" :value="value" />
  </inspector-input-base>
</template>
