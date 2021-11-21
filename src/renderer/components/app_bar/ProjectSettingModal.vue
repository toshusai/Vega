<template>
  <sp-dialog :isOpen="isOpenProjectSettings" header="Project Settings">
    <div style="width: min-content">
      <sp-field-label>Project Name</sp-field-label>
      <sp-textfield
        size="S"
        :value="project.name"
        @change="(v) => (project.name = v)"
      />
      <sp-field-label>Fps</sp-field-label>
      <sp-textfield
        size="S"
        :value="project.fps"
        @change="(v) => (project.fps = Number.parseInt(v))"
      />
      <sp-field-label>Resolution</sp-field-label>
      <div style="display: flex">
        <div>
          <sp-field-label>Width</sp-field-label>
          <sp-textfield
            size="S"
            style="width: 100%"
            :value="project.width"
            @change="(v) => (project.width = Number.parseInt(v))"
          />
        </div>
        <div>
          <sp-field-label>Height</sp-field-label>
          <sp-textfield
            size="S"
            style="width: 100%"
            :value="project.height"
            @change="(v) => (project.height = Number.parseInt(v))"
          />
        </div>
      </div>
      <sp-field-label>Duration</sp-field-label>
      <sp-textfield
        size="S"
        :value="project.duration"
        @change="(v) => (project.duration = Number.parseInt(v))"
      />
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
</template>
<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import { Project } from "~/models/Project";

@Component({})
export default class ProjectSettingModal extends Vue {
  @PropSync("isOpenSync") isOpenProjectSettings!: boolean;
  @PropSync("projectSync") project!: Project;
}
</script>