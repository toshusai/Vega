<template>
  <div class="root">
    <div class="container">
      <sp-dialog :isOpen="true" header="Vega">
        <h2>Vega is a open source browser based video editor.</h2>
        <div style="color: var(--red)">
          <div>Warning</div>
          <div>️This project is experimental.</div>
          <div>There may be many bugs.</div>
          <div>Encoding requires a lot of CPU resources.</div>
          <div>Please use at your own risk.</div>
        </div>
        <sp-button-group
          class="
            spectrum-Dialog-buttonGroup--noFooter
            spectrum-Dialog-buttonGroup
          "
        >
          <sp-button type="secondary" :group="true" @click="goDocuments">
            Documents
          </sp-button>
          <sp-button type="secondary" :group="true" @click="goGitHub">
            GitHub
          </sp-button>
          <sp-button type="primary" :group="true" @click="goEditorDemo">
            DEMO
          </sp-button>
          <sp-button :group="true" @click="goEditor"> Editor </sp-button>
        </sp-button-group>
      </sp-dialog>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: calc(100vw - 24px);
  height: calc(100vh - 24px);
  background-image: url("/static/img/vega_screenshot.png");
  background-size: contain;
  background-origin: content-box;
  background-position: center;
  display: flex;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class IndexPage extends Vue {
  goEditor() {
    this.$router.push("/editor");
  }

  goEditorDemo() {
    this.$router.push("/editor?demo=true");
  }

  goGitHub() {
    window.location.href = "https://github.com/toshusai/vega";
  }

  goDocuments() {
    window.location.href = "/docs";
  }
}
</script>