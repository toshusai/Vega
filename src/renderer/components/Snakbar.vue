<template>
  <div class="snakbar" :class="cssClass">
    <div v-if="isOpen" class="container">
      <slot v-if="$slots.default" />
      <div v-else class="message">
        {{ message }}
      </div>
      <button class="icon" @click="close">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.snakbar {
  position: fixed;
  bottom: 0px;
  right: 16px;
  padding: 8px;
  border: 1px solid var(--black);
  background-color: var(--red);
  box-shadow: 1px 1px 2px var(--vc-d-4);
  transition: 0.2s all;
  opacity: 0;
}

.snackbar-open {
  bottom: 16px;
  opacity: 1;
}

.container {
  display: flex;
}

.icon {
  width: 20px;
  height: 20px;
  margin: auto;
  margin-left: 4px;
}

.icon:hover {
  color: #ddd;
}

.message {
  margin: auto;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

const DEFAULT_DURATION = 3000;

@Component({})
export default class Snakbar extends Vue {
  isOpen: boolean = false;
  isOpenAnim: boolean = false;
  duration: number = DEFAULT_DURATION;
  message?: string = "";

  interval?: NodeJS.Timeout;

  get cssClass() {
    if (this.isOpenAnim) {
      return "snackbar-open";
    } else {
      return "";
    }
  }

  open(duration: number = DEFAULT_DURATION, message?: string) {
    this.message = message;
    this.isOpen = true;
    this.isOpenAnim = true;
    this.duration = duration;
    if (this.duration != 0) {
      this.interval = this.setTimeout(this.close, duration);
    }
  }

  close() {
    this.isOpenAnim = false;
    this.setTimeout(() => {
      this.isOpen = false;
    }, 200);
  }

  private setTimeout(callback: () => void, timeout: number) {
    if (this.interval) clearInterval(this.interval);
    return setTimeout(callback, timeout);
  }
}
</script>