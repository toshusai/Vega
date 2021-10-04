<template>
  <div class="card">
    <template v-if="step1">
      <div class="content">STEP (1/2)</div>
      <VegaProgress :rate="ccaptureProgress" />
    </template>
    <template v-if="step2">
      <div class="content">STEP (2/2)</div>
      <VegaProgress :rate="ffmpegProgress" />
    </template>

    <div v-if="!end" class="note">
      Do not change the tab until the rendering is complete.
    </div>
    <div v-if="end" class="note2">Rendering Completed !</div>

    <div class="content">
      <VegaButton @click="close">Close</VegaButton>
      <div style="margin: auto"></div>
      <VegaButton v-if="!isEncoding" @click="start">Start</VegaButton>
      <VegaButton v-if="end" @click="download">Download</VegaButton>
    </div>
  </div>
</template>

<style scoped>
.note {
  margin: 12px;
  color: var(--yellow);
  text-align: center;
}

.note2 {
  margin: 12px;
  color: var(--green);
  text-align: center;
}

.content {
  margin: 12px;
  text-align: center;
  display: flex;
}

.title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 12px;
}

.card {
  margin: auto;
  background-color: var(--vc-d-4);
  padding: 16px;
  border-radius: 2px;
  z-index: 1;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VegaProgress from "@/components/vega/VegaProgress.vue";
import VegaButton from "@/components/vega/VegaButton.vue";

@Component({
  components: {
    VegaProgress,
    VegaButton,
  },
})
export default class ExportingCard extends Vue {
  @Prop() ffmpegProgress: number = 0;
  @Prop() ccaptureProgress: number = 0;
  @Prop() isEncoding: boolean = false;

  get end() {
    return this.ffmpegProgress >= 1 && this.ccaptureProgress >= 1;
  }

  get step1() {
    return this.ccaptureProgress < 1;
  }

  get step2() {
    return this.ccaptureProgress >= 1 && this.ffmpegProgress < 1;
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