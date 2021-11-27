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

    <div v-if="!end" class="note">
      Do not change the tab until the rendering is complete.
    </div>
    <div v-if="end" class="note2">Rendering Completed !</div>

    <div v-if="!isSupportBroeser" style="display: flex">
      <h3 style="margin: auto; color: var(--red)">
        <sp-icon name="Alert" />
        Sorry Your Browser Not Supported Export
      </h3>
    </div>

    <div class="content">
      <sp-button :primary="true" @click="close">Close</sp-button>
      <div style="margin: auto"></div>
      <sp-button
        v-if="!isEncoding"
        :disabled="!isSupportBroeser"
        @click="start"
      >
        Start
      </sp-button>
      <sp-button v-if="end" :disabled="!isSupportBroeser" @click="download">
        Download
      </sp-button>
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
  margin-top: 16px;
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
  padding: 16px;
  border-radius: 2px;
  z-index: 1;
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