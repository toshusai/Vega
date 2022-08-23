<script setup lang="ts">

</script>

<template>
  <button v-bind="$attrs" class="v-btn">
    <slot />
  </button>
</template>

<style scoped>
.v-btn {
    border: 1px white solid;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
}
</style>
