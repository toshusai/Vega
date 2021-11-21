<template>
  <div class="app-bar">
    <AppBarMenuButton @click="openProjectMenu"> Project </AppBarMenuButton>
    <AppBarMenu ref="fileMenu">
      <AppBarMenuItem @click="openProject">
        Open Project
        <input
          ref="input"
          type="file"
          style="display: none"
          @change="changeOpenProject"
        />
      </AppBarMenuItem>
      <AppBarMenuItem @click="downloadProjectEmit">
        Save Project
      </AppBarMenuItem>
    </AppBarMenu>

    <AppBarMenuButton @click="renderVideo"> Render </AppBarMenuButton>
    <AppBarMenuButton @click="goAbout"> About</AppBarMenuButton>
    <AboutModal ref="aboutModal" />
  </div>
</template>

<style scoped>
.app-bar {
  height: 30px;
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
import { VegaError } from "~/plugins/error";
import AppBarMenuItem from "~/components/app_bar/AppBarMenuItem.vue";

@Component({
  components: {
    AppBarMenu,
    AppBarMenuButton,
    AppBarMenuItem,
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

  openProject() {
    this.input.click();
  }

  renderVideo() {
    this.renderVideoEmit();
  }

  async changeOpenProject(e: MouseEvent) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length == 1) {
      try {
        const file = target.files[0];
        const text = await file.text();
        this.openProjectEmit(JSON.parse(text));
      } catch {
        throw new VegaError("Project file is not JSON format.");
      }
    }
    this.fileMneu.close();
  }

  openProjectMenu(e: MouseEvent) {
    this.fileMneu.open(e);
  }
}
</script>