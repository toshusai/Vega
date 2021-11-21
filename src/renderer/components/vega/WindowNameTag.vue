<template>
  <div class="window-name-tag">
    {{ name }}
  </div>
</template>

<style scoped>
.window-name-tag {
  box-sizing: border-box;
  /* border: 1px solid var(--black); */
  padding: 1px 0px 1px 4px;
  /* background-color: var(--vc-d-3); */
  font-size: 14px;
  height: 20px;
  white-space: nowrap;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class WindowNameTag extends Vue {
  @Prop({ default: "" })
  name!: String;
}
</script>
