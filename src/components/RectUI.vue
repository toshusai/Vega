<script setup lang="ts">
import { Align } from '../core/Container'
import { Rect } from '../core/Rect'

const props = defineProps<{ align: Align; rect: Rect; parentAlign: Align }>()

const style = computed(() => ({
  width: props.parentAlign === 'vertical' ? '100%' : props.rect.width + '%',
  height: props.parentAlign === 'horizontal' ? '100%' : props.rect.height + '%',
  display: props.align === 'horizontal' ? 'flex' : 'block'
}))

const el = ref<HTMLDivElement | null>(null)
defineExpose({ el })
</script>

<template>
  <div ref="el" class="rect" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.rect {
  position: relative;
  box-sizing: border-box;
  -webkit-user-drag: none;
}
</style>
