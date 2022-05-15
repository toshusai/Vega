<script setup lang="ts">
import { isText } from "../../composables/useTimeline";
const { timeline, updateEffect } = useTimeline();

const isTextE = computed(() => {
  return (
    timeline.value.selectedStrips.length == 1 &&
    timeline.value.selectedStrips[0].effects.length == 1 &&
    timeline.value.selectedStrips[0].effects[0].type == "Text"
  );
});

const effect = computed(() => {
  if (isTextE.value) {
    return timeline.value.selectedStrips[0].effects[0];
  }
  return null;
});

function changeText(v: string | number, key: string) {
  const strip = timeline.value.selectedStrips[0];
  const effect = timeline.value.selectedStrips[0].effects[0];
  console.log(v);

  if (isText(effect)) {
    const newE = { ...effect };
    const newNewE = new Function(
      "effect",
      "value",
      `
effect.${key} = value;
return effect
`
    )(newE, v);
    updateEffect(strip.id, {
      ...newNewE,
    });
  }
}
</script>

<template>
  <div v-if="isTextE">
    <div class="flex mb-4 text-right">
      <div class="w-full pr-8">text:</div>
      <v-input
        :value="effect.text"
        @input="(e) => changeText(e.target.value, 'text')"
      />
    </div>
    <div class="flex mb-4 text-right">
      <div class="w-full pr-8">x:</div>
      <v-input
        :value="effect.position.x"
        @input="
          (e) =>
            changeText(
              { ...effect.position, x: Number.parseFloat(e.target.value) },
              'position'
            )
        "
      />
    </div>
    <div class="flex mb-4 text-right">
      <div class="w-full pr-8">y:</div>
      <v-input
        :value="effect.position.y"
        @input="
          (e) =>
            changeText(
              { ...effect.position, y: Number.parseFloat(e.target.value) },
              'position'
            )
        "
      />
    </div>
  </div>
</template>
