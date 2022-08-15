<script setup lang="ts">
defineProps({
  invalid: {
    default: false,
    type: Boolean
  }
})
</script>
<template>
  <input
    v-bind="$attrs"
    :class="{
      invalid
    }"
  >
</template>
<style scoped>
.invalid {
  border-color: var(--red-300);
}
.invalid:focus {
  outline: red 1px solid;
}
</style>
