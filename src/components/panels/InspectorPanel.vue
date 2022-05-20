<script setup lang="ts">
import { ComputedRef } from "vue";
import { Strip } from "~~/src/core/Strip";
import { TextStripEffect } from "~~/src/core/TextStripEffect";
import { isText } from "../../composables/useTimeline";
import TextStripInspector from "../TextStripInspector.vue";
const { timeline, updateEffect } = useTimeline();

const strip = computed(() => {
  return timeline.value.selectedStrips[0] as Strip | null;
});

const effect: ComputedRef<TextStripEffect | null> = computed(() => {
  return strip.value?.effects.find(
    (e) => e.type == "Text"
  ) as TextStripEffect | null;
});
</script>

<template>
  <div v-if="strip && effect && isText(effect)">
    <text-strip-inspector :strip="strip" />
  </div>
</template>
