<script setup lang="ts">
import { Strip } from "~/core/Strip";
import { ComputedRef } from "vue";
import { TextStripEffect } from "~/core/TextStripEffect";
import { isText, isVideo } from "~/composables/useTimeline";
import { eventToFloat } from "../utils/eventToFloat";
import { eventToString } from "../utils/eventToString";
import InspectorInput from "./InspectorInput.vue";
import { VideoStripEffect } from "../core/VideoStripEffect";
import { getEffect } from "../utils/getEffect";
import { StripEffect } from "../core/StripEffect";

const { updateEffect } = useTimeline();
const props = defineProps<{ strip: Strip }>();

const effect = computed(() =>
  getEffect<VideoStripEffect>(props.strip, "Video")
);

function changeText(v: any, key: string) {
  if (effect.value && isVideo(effect.value)) {
    const newE = { ...effect.value };
    const newNewE = new Function(
      "effect",
      "value",
      `
effect.${key} = value;
return effect
`
    )(newE, v);

    updateEffect(props.strip?.id, {
      ...newNewE,
    });
  }
}
</script>

<template>
  <div v-if="effect && isVideo(effect)">
    <div class="p-4">
      <div>TextEffect</div>
      <inspector-input
        label="x"
        :value="effect.position.x"
        @input="
          (e) =>
            changeText({ ...effect?.position, x: eventToFloat(e) }, 'position')
        "
      />
    </div>
  </div>
</template>
