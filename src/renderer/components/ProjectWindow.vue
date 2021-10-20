<template>
  <div class="root">
    <WindowNameTag name="Project" />
    <div style="padding: 4px">
      <label class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">name</label>
      <VegaValueInput class="w100" :value="name" @change="changeName" />

      <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">duration</div>
      <VegaValueInput
        class="w100"
        type="number"
        :value="duration"
        @change="changeDuration"
      />

      <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">fps</div>
      <VegaSelect
        class="w100"
        :value="fps"
        :items="fpsItems"
        @change="changeFps"
      />

      <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">
        resolution
      </div>
      <div style="display: flex">
        <div>
          <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">
            width
          </div>
          <VegaValueInput
            class="w100"
            type="number"
            :value="width"
            @change="changeWidth"
          />
        </div>
        <div>
          <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">
            height
          </div>
          <VegaValueInput
            class="w100"
            type="number"
            :value="height"
            @change="changeHeight"
          />
        </div>
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
.w100 {
  width: 100%;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VegaInput from "./vega/VegaInput.vue";
import { OptionKeyValue } from "./vega/VegaSelect.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { Strip } from "~/models";
import VegaValueInput from "~/components/vega/VegaValueInput.vue";
import VegaSelect from "~/components/vega/VegaSelect.vue";

@Component({
  components: {
    WindowNameTag,
    VegaSelect,
    VegaInput,
    VegaValueInput,
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
