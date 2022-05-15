<script setup lang="ts">
import { Strip } from "~~/src/core/Strip";

const props = defineProps<{ strips: Strip[] }>();

const { selectStrip } = useTimeline();
</script>

<template>
  <div class="layer border-default" @click="() => selectStrip([])">
    <PanelsStrip v-for="(strip, i) in props.strips" :key="i" :strip="strip" />
  </div>
</template>

<style scoped>
.layer {
  display: flex;
  position: relative;
  height: 20px;
  border-bottom: 1px solid;
  box-sizing: border-box;
}
</style>
