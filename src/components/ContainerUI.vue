<script setup lang="ts">
import { Container } from "../core/Container";
import PanelUI from "./PanelUI.vue";
import ResizeTop from "./ResizeTop.vue";
import ResizeLeft from "./ResizeLeft.vue";
import { onDragStart } from "../utils/onDragStart";
import { Vector2 } from "three";
import RectUI from "./RectUI.vue";

const props = defineProps<{ container: Container }>();
const { resizeContainer } = useContainer();
const rectRef = ref([]);
const move = (i: number) => {
  return (delta: Vector2) => {
    if (!rectRef.value && rectRef.value.length == 0) return;

    const rect = rectRef.value[i].el.parentElement?.getBoundingClientRect();
    if (rect) {
      delta.x = (delta.x / rect.width) * 100;
      delta.y = (delta.y / rect.height) * 100;

      resizeContainer({ id: props.container.children[i].id, delta });
    }
  };
};
onMounted(() => {
  if (!rectRef.value && rectRef.value.length > 0) return;
});
</script>

<template>
  <PanelUI
    v-if="props.container.panel"
    :name="props.container.panel.type"
    :container-id="props.container.id"
  />
  <template v-else>
    <div :id="props.container.id"></div>
    <RectUI
      v-for="(child, i) in props.container.children"
      :key="i"
      ref="rectRef"
      :rect="child.rect"
      :align="child.align"
      :parent-align="props.container.align"
    >
      <ContainerUI :container="child" />
      <template v-if="i !== 0">
        <ResizeTop
          v-if="props.container.align == 'vertical'"
          @mousedown="(e) => onDragStart(e, move(i))"
        >
        </ResizeTop>
        <ResizeLeft
          v-else
          @mousedown="(e) => onDragStart(e, move(i))"
        ></ResizeLeft>
      </template>
    </RectUI>
  </template>
</template>
