<template>
  <div v-bind="$attrs" class="resize-top" />
</template>

<style>
.resize-top {
  top: -1px;
  height: 2px;
  position: absolute;
  left: 0;
  transition-property: all;
  width: 100%;
  background: #eee;
  cursor: ns-resize;
  user-select: none;
}
.resize-top:hover {
  top: -2px;
  height: 4px;
}
</style>
