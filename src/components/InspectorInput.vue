<script setup lang="ts">
const props = defineProps<{ label: string }>();
</script>
<template>
  <div class="flex mb-4">
    <div class="w-full pr-8">{{ props.label }} :</div>
    <v-input v-bind="$attrs" />
  </div>
</template>
