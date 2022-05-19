<script setup lang="ts">
import { TextStripEffectObject } from "../core/TextStripEffectObject";
import { onDragStart } from "../utils/onDragStart";

const { timeline, updateEffect } = useTimeline();

const props = defineProps<{ scale: 1 }>();

const strip = computed(() => timeline.value.selectedStrips[0]);
const effect = computed(() => strip.value && strip.value.effects[0]);
const style = ref({});
function updateStyle() {
  if (!effect.value) return { display: "none" };
  if (!isText(effect.value)) return { display: "none" };
  const width = timeline.value.width;
  const height = timeline.value.height;

  const obj = effectObjectMap.get(effect.value.id);
  if (!(obj instanceof TextStripEffectObject)) return { display: "none" };

  //   console.log(obj.canvas.width, props.scale, obj.canvas.);

  return {
    left:
      (width / 2 + effect.value.position.x - obj.mesureWidth / 2) *
        props.scale +
      "px",
    bottom:
      (height / 2 + effect.value.position.y - obj.mesureHeight / 2) *
        props.scale +
      "px",
    width: obj.mesureWidth * props.scale + "px",
    height: obj.mesureHeight * props.scale + "px",
  };
}

onMounted(() => {
  const update = () => {
    style.value = updateStyle();
    window.requestAnimationFrame(update);
  };
  update();
});

function drag(e: MouseEvent) {
  onDragStart(e, (delta) => {
    if (isText(effect.value)) {
      const newE = { ...effect.value };
      const p = {
        x: newE.position.x + delta.x / props.scale,
        y: newE.position.y - delta.y / props.scale,
        z: newE.position.z,
      };
      newE.position = p;
      updateEffect(strip.value.id, {
        ...newE,
      });
    }
  });
}
</script>

<template>
  <div
    class="gizmo text-brand absolute cursor-pointer"
    :style="style"
    @pointerdown="drag"
  ></div>
</template>

<style scoped>
.gizmo {
  border: 1px solid #0096fa;
  box-sizing: border-box;
}
</style>
