<script setup lang="ts">
defineProps<{ as?: string }>()
</script>

<template>
  <component :is="as ?? 'button'" v-bind="$attrs" class="v-btn">
    <slot />
  </component>
</template>

<style scoped>
.v-btn {
  border: 1px white solid;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  line-height: 12px;
}
</style>
