<template>
  <div class="root">
    <div class="container">
      <div class="title">
        <h2>Vega is a open source browser based video editor.</h2>
        <h3 class="note">
          <div>⚠ Warning ⚠</div>
          <div>️This project is experimental.</div>
          <div>There may be many bugs.</div>
          <div>Encoding requires a lot of CPU resources.</div>
          <div>Please use at your own risk.</div>
        </h3>
        <div class="buttons">
          <VegaButton @click="goEditor">Editor</VegaButton>
          <VegaButton @click="goDocuments">Documents</VegaButton>
          <VegaButton @click="goGitHub">GitHub</VegaButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  background-color: var(--blue-700);
  padding: 12px;
}

.container {
  width: calc(100vw - 24px);
  height: calc(100vh - 24px);
  background-image: url("/static/img/vega_screenshot.png");
  background-size: contain;
  background-origin: content-box;
  background-position: center;
  display: flex;
}

.title {
  padding: 24px;
  text-align: center;
  margin: auto;
  background: var(--blue-700);
  box-shadow: 4px 4px 16px black;
}

.note {
  margin: 8px;
  color: var(--yellow);
}

.buttons {
  margin-top: 24px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import VegaButton from "~/components/vega/VegaButton.vue";

@Component({
  components: { VegaButton },
})
export default class IndexPage extends Vue {
  goEditor() {
    this.$router.push("/editor");
  }

  goGitHub() {
    window.location.href = "https://github.com/toshusai/vega";
  }

  goDocuments() {
    window.location.href = "/docs";
  }
}
</script>