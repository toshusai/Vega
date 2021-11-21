<template>
  <sp-dialog :isOpen="isOpen" header="About">
    <div>
      <h4>Version: {{ version }}</h4>
      <h5>
        <sp-link class="link" href="/">Top</sp-link>
      </h5>
      <h5>
        <sp-link class="link" href="/docs">Documents</sp-link>
      </h5>
      <h5>
        <sp-link class="link" href="https://github.com/toshusai/vega">
          GitHub
        </sp-link>
      </h5>
    </div>
    <template #footer>
      <div
        class="
          spectrum-ButtonGroup
          spectrum-Dialog-buttonGroup
          spectrum-Dialog-buttonGroup--noFooter
        "
      >
        <sp-button type="secondary" style="margin-left: auto" @click="close">
          Close
        </sp-button>
      </div>
    </template>
  </sp-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { VEGA_VERSION } from "~/models";

@Component({})
export default class AboutModal extends Vue {
  isOpen = false;

  get version() {
    return VEGA_VERSION;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
</script>