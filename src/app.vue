<script setup lang="ts">
const { container } = useContainer();
</script>

<template>
  <div
    class="root"
    :style="{
      display: container.align == 'horizontal' ? 'flex' : 'block',
    }"
  >
    <ContainerUI :container="container" />
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
.root {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>
