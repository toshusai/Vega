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

    <div style="margin: auto 4px auto auto">
      <sp-action-button :quiet="true" size="S" @click="renderVideo">
        <sp-icon name="BoxExport" style="width: 12px" />
      </sp-action-button>
      <sp-action-button
        :quiet="true"
        size="S"
        @click="isOpenProjectSettings = true"
      >
        <sp-icon name="Settings" style="width: 12px" />
      </sp-action-button>
      <sp-action-button :quiet="true" size="S" @click="goAbout">
        <sp-icon name="Info" style="width: 12px" />
      </sp-action-button>
    </div>
    <about-modal ref="aboutModal" />
    <project-setting-modal
      :isOpenSync.sync="isOpenProjectSettings"
      :projectSync.sync="project"
    />
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
import { Component, PropSync, Ref } from "vue-property-decorator";
import AppBarMenu from "./AppBarMenu.vue";
import AppBarMenuButton from "./AppBarMenuButton.vue";
import AboutModal from "./AboutModal.vue";
import ProjectSettingModal from "./ProjectSettingModal.vue";
import { VegaError } from "~/plugins/error";
import AppBarMenuItem from "~/components/app_bar/AppBarMenuItem.vue";
import { isProject, Project } from "~/models/Project";

@Component({
  components: {
    ProjectSettingModal,
    AppBarMenu,
    AppBarMenuButton,
    AppBarMenuItem,
    AboutModal,
  },
})
export default class AppBar extends Vue {
  @Ref() aboutModal?: AboutModal;

  @PropSync("projectSync") project!: Project;

  isOpenProjectSettings: boolean = false;

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
        const iproject = JSON.parse(text);
        if (isProject(iproject)) {
          this.openProjectEmit(new Project(iproject));
        } else {
          throw new VegaError("Invalid Project file.");
        }
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