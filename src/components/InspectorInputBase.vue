<script setup lang="ts">
const props = defineProps<{ label: string }>();
</script>
<template>
  <div class="flex mb-4 whitespace-nowrap text-right">
    <div class="w-full pr-8">{{ props.label }} :</div>
    <slot />
  </div>
</template>
