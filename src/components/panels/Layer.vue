<script setup lang="ts">
import { Layer } from "~/core/Timeline";
const props = defineProps<{ layer: Layer }>();

const { selectStrip } = useTimeline();
</script>

<template>
  <div class="layer border-default" @click="() => selectStrip([])">
    <PanelsStrip
      v-for="(strip, i) in props.layer.strips"
      :key="i"
      :strip="strip"
    />
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
