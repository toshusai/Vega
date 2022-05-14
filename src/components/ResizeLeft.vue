<template>
  <div
    v-bind="$attrs"
    class="resize-left top-0 h-full absolute bg-background2 cursor-ew-resize transition-all"
  ></div>
</template>

<style>
.resize-left {
  left: -1px;
  width: 2px;
}
.resize-left:hover {
  left: -2px;
  width: 4px;
}
</style>
