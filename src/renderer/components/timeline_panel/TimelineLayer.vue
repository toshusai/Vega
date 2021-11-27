<template>
  <div>
    <div class="line"></div>
    <div class="linehr" />
  </div>
</template>

<style scoped>
.linehr {
  height: 1px;
  width: 100%;
  background-color: #ccc;
}

.line {
  height: 30px;
  display: flex;
  box-sizing: border-box;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class TimelineLayer extends Vue {}
</script>
