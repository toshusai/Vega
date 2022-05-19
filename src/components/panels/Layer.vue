<script setup lang="ts">
import { Strip } from "~~/src/core/Strip";

const props = defineProps<{ strips: Strip[] }>();

const { selectStrip } = useTimeline();
</script>

<template>
  <div class="layer border-default" @click="() => selectStrip([])">
    <!-- <PanelsStripUI v-for="(strip, i) in props.strips" :key="i" :strip="strip" /> -->
  </div>
</template>

<style scoped></style>
