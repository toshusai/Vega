<script setup lang="ts">
const props = defineProps<{ label: string; value: string | number }>();
</script>
<template>
  <div class="flex mb-4 whitespace-nowrap text-right">
    <div class="w-full pr-8">{{ props.label }} :</div>
    <v-input v-bind="$attrs" :value="value" />
  </div>
</template>
