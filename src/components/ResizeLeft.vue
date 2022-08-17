<template>
  <div v-bind="$attrs" class="resize-left" />
</template>

<style>
.resize-left {
  left: -1px;
  width: 2px;
  position: absolute;
  top: 0;
  transition-property: all;
  background: #eee;
  height: 100%;
  cursor: ew-resize;
  user-select: none;
}
.resize-left:hover {
  left: -2px;
  width: 4px;
}
</style>
