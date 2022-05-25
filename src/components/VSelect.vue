<script setup lang="ts"></script>
<template>
  <select
    v-bind="$attrs"
    class="bg-transparent border-default border-2 rounded-4 pl-4 text-sm w-full"
  >
    <slot />
  </select>
</template>
