<script setup lang="ts"></script>
<template>
  <select v-bind="$attrs" class="select">
    <slot />
  </select>
</template>

<style scoped>
.select {
  padding-left: 1rem;
  background-color: transparent;
  font-size: 0.875rem;
  line-height: 1.25rem;
  width: 100%;
  border-width: 2px;
}
</style>
