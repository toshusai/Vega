<template>
  <div
    v-bind="$attrs"
    class="resize-top absolute bg-background2 cursor-ns-resize w-full left-0 transition-all"
  ></div>
</template>

<style>
.resize-top {
  top: -1px;
  height: 2px;
}
.resize-top:hover {
  top: -2px;
  height: 4px;
}
</style>
