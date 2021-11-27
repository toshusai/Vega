<template>
  <div class="card">
    <div style="display: flex">
      <sp-progress-bar :value="progress1" style="width: 45%">
        STEP (1/2)
      </sp-progress-bar>
      <sp-progress-bar :value="progress2" style="width: 45%; margin-left: auto">
        STEP (2/2)
      </sp-progress-bar>
    </div>

    <div style="display: flex">
      <sp-inline-alert v-if="showWarn" type="negative" class="inline-alert">
        <template #header>Warning</template>
        Do not change the tab until the rendering is complete.
      </sp-inline-alert>
      <sp-inline-alert v-if="end" type="success" class="inline-alert">
        <template #header>Success</template>
        Rendering Completed !
      </sp-inline-alert>
      <sp-inline-alert
        v-if="!isSupportBroeser"
        type="error"
        class="inline-alert"
      >
        <template #header>Error</template>
        Rendering Completed ! Sorry Your Browser Not Supported Export
      </sp-inline-alert>
    </div>
  </div>
</template>

<style scoped>
.inline-alert {
  margin: 23px auto 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VegaProgress from "@/components/vega/VegaProgress.vue";
import { isSupportBroeser } from "~/plugins/browser";

@Component({
  components: {
    VegaProgress,
  },
})
export default class ExportingCard extends Vue {
  @Prop() ffmpegProgress: number = 0;
  @Prop() ccaptureProgress: number = 0;
  @Prop() isEncoding: boolean = false;

  get end() {
    return this.ffmpegProgress >= 1 && this.ccaptureProgress >= 1;
  }

  get isSupportBroeser() {
    return isSupportBroeser();
  }

  get progress1() {
    return Math.round(this.ccaptureProgress * 100);
  }

  get progress2() {
    return Math.round(this.ffmpegProgress * 100);
  }

  get inProgress() {
    return this.ccaptureProgress > 0;
  }

  get showWarn() {
    return !this.end && this.inProgress;
  }

  close() {
    this.$emit("close");
  }

  start() {
    this.$emit("start");
  }

  download() {
    this.$emit("download");
  }
}
</script>