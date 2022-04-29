<template>
  <div v-bind="$attrs" class="resize-left"></div>
</template>

<style>
.resize-left {
  position: absolute;
  top: 0;
  left: -4px;
  width: 4px;
  height: 100%;
  background-color: gray;
  cursor: ew-resize;
}
</style>
