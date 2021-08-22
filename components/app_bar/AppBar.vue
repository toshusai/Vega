<template>
  <div class="app-bar">
    <AppBarMenuButton @click="clickFile"> File </AppBarMenuButton>
    <AppBarMenu ref="fileMenu">
      <AppBarMenuItem @click="openFile">
        Open File
        <input
          ref="input"
          type="file"
          style="display: none"
          @change="changeOpenFile"
        />
      </AppBarMenuItem>
      <AppBarMenuItem @click="downloadProjectEmit"> Save File </AppBarMenuItem>
    </AppBarMenu>

    <AppBarMenuButton @click="renderVideo"> Render </AppBarMenuButton>
    <AppBarMenuButton @click="goAbout"> About</AppBarMenuButton>
    <AboutModal ref="aboutModal" />
  </div>
</template>

<style scoped>
.app-bar {
  height: 18px;
  display: flex;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import AppBarMenu from "./AppBarMenu.vue";
import AppBarMenuButton from "./AppBarMenuButton.vue";
import AboutModal from "./AboutModal.vue";
import { Project } from "~/models";

@Component({
  components: {
    AppBarMenu,
    AppBarMenuButton,
    AboutModal,
  },
})
export default class AppBar extends Vue {
  @Ref() aboutModal?: AboutModal;
  get fileMneu(): any {
    return (this.$refs as any).fileMenu;
  }

  get input(): any {
    return (this.$refs as any).input;
  }

  downloadProjectEmit() {
    this.$emit("downloadProject");
  }

  openProjectEmit(project: Project) {
    this.$emit("openProject", project);
  }

  goAbout() {
    this.aboutModal?.open();
  }

  renderVideoEmit() {
    this.$emit("renderVideo");
  }

  openFile() {
    this.input.click();
  }

  renderVideo() {
    this.renderVideoEmit();
  }

  async changeOpenFile(e: MouseEvent) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length == 1) {
      const file = target.files[0];
      const text = await file.text();
      this.openProjectEmit(JSON.parse(text));
    }
  }

  clickFile(e: MouseEvent) {
    this.fileMneu.open(e);
  }
}
</script>