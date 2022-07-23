<script setup lang="ts">
const props = defineProps<{ label: string }>()
</script>
<template>
  <div class="label">
    <div style="width: 100%; padding-right: 8px;">
      {{ props.label }} :
    </div>
    <slot />
  </div>
</template>

<style scoped>
.label {
  display: flex;
  margin-bottom: 4px;
  white-space: nowrap;
  text-align: right;
}
</style>
