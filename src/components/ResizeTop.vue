<template>
  <div v-bind="$attrs" class="resize-top"></div>
</template>

<style>
.resize-top {
  position: absolute;
  top: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #ccc;
  cursor: ns-resize;
  z-index: 1;
}
</style>
