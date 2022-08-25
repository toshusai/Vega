<script setup lang="ts">
import { Container } from '../core/Container'
import { onDragStart } from '../utils/onDragStart'
import { IVector2 } from '../core/IVector2'

const props = defineProps<{ container: Container }>()
const { resizeContainer } = useContainer()
const rectRef = ref([] as typeof RectUI[])
const move = (i: number) => {
  return (delta: IVector2, _e: MouseEvent) => {
    if (!rectRef.value || rectRef.value.length === 0) { return }

    const rect = rectRef.value[i].el.parentElement?.getBoundingClientRect()
    if (rect) {
      delta.x = (delta.x / rect.width) * 100
      delta.y = (delta.y / rect.height) * 100

      resizeContainer({ id: props.container.children[i].id, delta })
    }
  }
}
</script>

<template>
  <panel-ui v-if="props.container.panel" :name="props.container.panel.type" :container-id="props.container.id" />
  <template v-else>
    <div :id="props.container.id" />
    <rect-ui
      v-for="(child, i) in props.container.children"
      :key="i"
      ref="rectRef"
      :rect="child.rect"
      :align="child.align"
      :parent-align="props.container.align"
    >
      <container-ui :container="child" />
      <template v-if="i !== 0">
        <resize-top
          v-if="props.container.align === 'vertical'"
          @mousedown="(e: MouseEvent) => onDragStart(e, move(i))"
        />
        <resize-left v-else @mousedown="(e: MouseEvent) => onDragStart(e, move(i))" />
      </template>
    </rect-ui>
  </template>
</template>
