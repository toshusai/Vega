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
    <sp-action-button
      :quiet="true"
      size="S"
      style="margin: auto 4px auto auto"
      @click="isOpenProjectSettings = true"
    >
      <sp-icon name="Settings" style="width: 12px" />
    </sp-action-button>
    <AboutModal ref="aboutModal" />
    <sp-dialog :isOpen="isOpenProjectSettings" header="Project Settings">
      <div style="width: min-content">
        <sp-field-label>Project Name</sp-field-label>
        <sp-textfield size="S" />
        <sp-field-label>Fps</sp-field-label>
        <sp-textfield size="S" />
        <sp-field-label>Resolution</sp-field-label>
        <div style="display: flex">
          <div>
            <sp-field-label>Width</sp-field-label>
            <sp-textfield size="S" style="width: 100%" />
          </div>
          <div>
            <sp-field-label>Height</sp-field-label>
            <sp-textfield size="S" style="width: 100%" />
          </div>
        </div>
        <sp-field-label>Duration</sp-field-label>
        <sp-textfield size="S" />
      </div>
      <template #footer>
        <div
          class="
            spectrum-ButtonGroup
            spectrum-Dialog-buttonGroup
            spectrum-Dialog-buttonGroup--noFooter
          "
        >
          <sp-button
            type="primary"
            :group="true"
            @click="isOpenProjectSettings = false"
          >
            OK
          </sp-button>
        </div>
      </template>
    </sp-dialog>
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