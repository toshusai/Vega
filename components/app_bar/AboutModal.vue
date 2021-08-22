<template>
  <modal ref="modal">
    <div class="card">
      <div class="buttons">
        <div>
          <a class="link" href="/">Top</a>
        </div>
        <div>
          <a class="link" href="/docs" @click="toDoc">Documents</a>
        </div>
        <div>
          <a class="link" href="https://github.com/toshusai/vega">GitHub</a>
        </div>
      </div>
      <div class="buttons">
        <VegaButton @click="close"> Close </VegaButton>
      </div>
    </div>
  </modal>
</template>

<style scoped>
.card {
  background-color: var(--vc-d-4);
  padding: 12px;
  margin: auto;
}

.link {
  color: var(--blue-100);
}

.link:visited {
  color: var(--blue);
}

.buttons {
  margin: 12px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import Modal from "../vega/Modal.vue";

@Component({
  components: { Modal },
})
export default class AboutModal extends Vue {
  @Ref() modal?: Modal;
  open() {
    this.modal?.open();
  }

  close() {
    this.modal?.close();
  }

  toDoc() {
    this.modal?.close();
  }
}
</script>