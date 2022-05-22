<script setup lang="ts">
const props = defineProps<{
  element: HTMLElement;
}>();

const isDraging = ref(false);
const left = ref(0);
const top = ref(0);
const width = ref(0);
const height = ref(0);

const startX = ref(0);
const startY = ref(0);
onMounted(() => {
  props.element.addEventListener("mousedown", (e) => {
    console.log("md");
    isDraging.value = true;
    const parentRect = props.element.getBoundingClientRect();
    startX.value = e.clientX - parentRect.left;
    startY.value = e.clientY - parentRect.top;
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDraging.value) return;
    const parentRect = props.element.getBoundingClientRect();
    const cx = e.clientX - parentRect.left;
    const cy = e.clientY - parentRect.top;
    left.value = cx < startX.value ? cx : startX.value;
    top.value = cy < startY.value ? cy : startY.value;
    width.value = Math.abs(cx - startX.value);
    height.value = Math.abs(cy - startY.value);
  });
  window.addEventListener("mouseup", () => {
    isDraging.value = false;
    left.value = 0;
    top.value = 0;
    width.value = 0;
    height.value = 0;
  });
});

const style = computed(() => {
  return {
    left: `${left.value}px`,
    top: `${top.value}px`,
    width: `${width.value}px`,
    height: `${height.value}px`,
  };
});
</script>
<template>
  <div v-show="isDraging" class="select-rect absolute" :style="style"></div>
</template>
<style scoped>
.select-rect {
  background: rgba(96, 96, 255, 0.1);
  border: 1px solid rgba(96, 96, 255, 0.2);
  box-sizing: border-box;
  z-index: 3;
}
</style>
