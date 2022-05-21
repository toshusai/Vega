<script setup lang="ts">
import { Strip } from "~/core/Strip";
import { ComputedRef } from "vue";
import { TextStripEffect } from "~/core/TextStripEffect";
import { isText } from "~/composables/useTimeline";
import { eventToFloat } from "../utils/eventToFloat";
import { eventToString } from "../utils/eventToString";
import InspectorInput from "./InspectorInput.vue";
// var colors = "#194d33";
const { updateEffect } = useTimeline();
const props = defineProps<{ strip: Strip }>();

const effect: ComputedRef<TextStripEffect | null> = computed(() => {
  return props.strip.effects.find(
    (e) => e.type == "Text"
  ) as TextStripEffect | null;
});

function changeText(v: any, key: string) {
  if (effect.value && isText(effect.value)) {
    const newE = { ...effect.value };
    const newNewE = new Function(
      "effect",
      "value",
      `
effect.${key} = value;
return effect
`
    )(newE, v);

    console.log(key, v);

    updateEffect(props.strip?.id, {
      ...newNewE,
    });
  }
}

function u(x) {
  console.log(x);
}
</script>

<template>
  <div v-if="effect && isText(effect)">
    <div class="p-4">
      <div>TextEffect</div>
      <inspector-input
        label="Text"
        :value="effect.text"
        @input="(e) => changeText(eventToString(e), 'text')"
      />
      <inspector-input
        label="x"
        :value="effect.position.x"
        @update-number="
          (n) => changeText({ ...effect?.position, x: n }, 'position')
        "
        @input="
          (e) =>
            changeText({ ...effect?.position, x: eventToFloat(e) }, 'position')
        "
      />
      <inspector-input
        label="y"
        :value="effect.position.y"
        @update-number="
          (n) => changeText({ ...effect?.position, y: n }, 'position')
        "
        @input="
          (e) =>
            changeText({ ...effect?.position, y: eventToFloat(e) }, 'position')
        "
      />
      <inspector-input
        label="fontSize"
        :value="effect.size"
        @input="(e) => changeText(eventToFloat(e), 'size')"
      />
      <inspector-color-input
        label="color"
        :value="effect.color"
        @update-color="(e) => changeText(e, 'color')"
      />
      <inspector-input
        label="style"
        :value="effect.style"
        @input="(e) => changeText(eventToString(e), 'style')"
      />
      <inspector-input
        label="Family"
        :value="effect.family"
        @input="(e) => changeText(eventToString(e), 'family')"
      />
      <inspector-input
        label="shadowColor"
        :value="effect.shadowColor"
        @input="(e) => changeText(eventToString(e), 'shadowColor')"
      />
      <inspector-input
        label="shadowBlur"
        :value="effect.shadowBlur"
        @input="(e) => changeText(eventToString(e), 'shadowBlur')"
      />
      <inspector-input
        label="outlineColor"
        :value="effect.outlineColor"
        @input="(e) => changeText(eventToString(e), 'outlineColor')"
      />
      <inspector-input
        label="outlineWidth"
        :value="effect.outlineWidth"
        @input="(e) => changeText(eventToString(e), 'outlineWidth')"
      />
    </div>
  </div>
</template>
