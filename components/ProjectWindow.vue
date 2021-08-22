<template>
  <div class="root">
    <WindowNameTag name="Project" />
    <div style="padding: 4px">
      <div class="label">name</div>
      <VegaValueInput :value="name" @change="changeName" />

      <hr class="hr" />

      <div class="label">duration</div>
      <VegaValueInput
        type="number"
        :value="duration"
        @change="changeDuration"
      />

      <hr class="hr" />

      <div class="label">fps</div>
      <VegaSelect :value="fps" :items="fpsItems" @change="changeFps" />

      <hr class="hr" />

      <div class="label">resolution</div>
      <div style="display: flex">
        <VegaValueInput type="number" :value="width" @change="changeWidth" />
        x
        <VegaValueInput type="number" :value="height" @change="changeHeight" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  border: 1px solid var(--black);
}
.label {
  font-size: 16px;
}
.hr {
  height: 1px;
  margin: 4px 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VegaInput from "./vega/VegaInput.vue";
import { OptionKeyValue } from "./vega/VegaSelect.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { Strip } from "~/models";

@Component({
  components: {
    WindowNameTag,
    VegaInput,
  },
})
export default class ProjectWindow extends Vue {
  @Prop({ default: 0 })
  duration!: number;

  @Prop({ default: () => [] })
  strips!: Strip[];

  @Prop({ default: 60 })
  fps!: number;

  @Prop({})
  canvas!: HTMLCanvasElement;

  @Prop({ default: 0 })
  currentTime!: number;

  @Prop({ default: 1920 })
  width!: number;

  @Prop({ default: 1080 })
  height!: number;

  @Prop({ default: "untitled" })
  name!: string;

  fpsItems: OptionKeyValue[] = [60, 30, 12, 4, 2, 1].map((num) => {
    return { text: num.toString(), value: num };
  });

  changeDuration(duration: number) {
    this.$emit("changeDuration", duration);
  }

  changeWidth(width: number) {
    this.$emit("changeWidth", width);
  }

  changeHeight(height: number) {
    this.$emit("changeHeight", height);
  }

  changeFps(fpsItem: OptionKeyValue) {
    this.$emit("changeFps", fpsItem.value);
  }

  changeName(name: string) {
    this.$emit("changeName", name);
  }
}
</script>
