<script setup lang="ts">
import { ComputedRef } from "vue";
import { Strip } from "~~/src/core/Strip";
import { TextStripEffect } from "~~/src/core/TextStripEffect";
import { getEffect } from "~~/src/utils/getEffect";
import { isText, isVideo } from "../../composables/useTimeline";
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
  <template v-if="strip">
    <text-strip-inspector v-if="getEffect(strip, 'Text')" :strip="strip" />
    <video-strip-inspector
      v-else-if="getEffect(strip, 'Video')"
      :strip="strip"
    />
  </template>
</template>
