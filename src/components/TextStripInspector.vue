<script setup lang="ts">
import { Strip } from "~/core/Strip";
import { ComputedRef } from "vue";
import { TextStripEffect } from "~/core/TextStripEffect";
import { isText } from "~/composables/useTimeline";
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

function changeText(v: object | string | number, key: string) {
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
</script>

<template>
  <div v-if="effect && isText(effect)">
    <div class="p-4">
      <div>TextEffect</div>
      <inspector-string-input
        label="Text"
        :value="effect.text"
        @input="(e) => changeText(eventToString(e), 'text')"
      />
      <inspector-input
        label="x"
        :value="effect.position.x"
        @input="
          (num) => changeText({ ...effect?.position, x: num }, 'position')
        "
      />
      <inspector-input
        label="y"
        :value="effect.position.y"
        @input="(e) => changeText({ ...effect?.position, y: e }, 'position')"
      />
      <inspector-input
        label="fontSize"
        :value="effect.size"
        @input="(n) => changeText(n, 'size')"
      />
      <inspector-color-input
        label="color"
        :value="effect.color"
        @update-color="(e) => changeText(e, 'color')"
      />
      <inspector-string-input
        label="style"
        :value="effect.style"
        @input="(e) => changeText(eventToString(e), 'style')"
      />
      <inspector-string-input
        label="Family"
        :value="effect.family"
        @input="(e) => changeText(eventToString(e), 'family')"
      />
      <inspector-color-input
        label="shadowColor"
        :value="effect.shadowColor"
        @update-color="(e) => changeText(e, 'shadowColor')"
      />
      <inspector-input
        label="shadowBlur"
        :value="effect.shadowBlur"
        @input="(n) => changeText(n, 'shadowBlur')"
      />
      <inspector-color-input
        label="outlineColor"
        :value="effect.outlineColor"
        @update-color="(e) => changeText(e, 'outlineColor')"
      />
      <inspector-input
        label="outlineWidth"
        :value="effect.outlineWidth"
        @input="(n) => changeText(n, 'outlineWidth')"
      />
    </div>
  </div>
</template>
