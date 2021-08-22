<template>
  <div class="zoom">
    <div style="margin: auto"></div>
    <button class="button" style="margin-left: 0" @click="downScale">
      <svg class="icon" viewBox="0 0 24 24">
        <path
          fill="white"
          d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z"
        />
      </svg>
    </button>

    <button class="button" style="margin-left: 0" @click="upScale">
      <svg class="icon" viewBox="0 0 24 24">
        <path
          fill="white"
          d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.zoom {
  /* position: absolute; */
  /* left: 1px; */
  /* 20px for window tag name scroll bar */
  /* WARN maybe cause unexpected style */
  /* top: 20px; */
  display: flex;
}

.button {
  z-index: 10;
  padding: 0;
  height: 20px;
  width: 20px;
  display: flex;
  border: none;
  background-color: var(--vc-d-4);
  box-sizing: border-box;
}

.button:hover {
  background: black;
  cursor: pointer;
  background-color: var(--vc-d-3);
}

.icon {
  height: 20px;
  width: 20px;
  margin: auto;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class TimelineZoomButtons extends Vue {
  upScale() {
    this.$emit("upScale");
  }

  downScale() {
    this.$emit("downScale");
  }
}
</script>
