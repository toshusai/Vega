<template>
  <div class="error">
    <sp-icon
      name="Alert"
      style="min-width: 12px; width: 12px; margin: auto 2px auto 2px"
    />
    <span style="margin: auto auto auto 2px">Not Found Asset</span>
  </div>
</template>
<style scoped>
.error {
  display: flex;
  width: 100%;
  padding-left: 5px;
  height: 100%;
}
</style>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class StripError extends Vue {}
</script>