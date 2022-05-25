<script setup lang="ts">
import { CSSProperties } from 'vue'
import { Strip } from '~~/src/core/Strip'
import undo from '~~/src/core/Undo'
import { onDragStart } from '~~/src/utils/onDragStart'
const props = defineProps<{ strip: Strip }>()

const { timeline, moveStrip, selectStrip } = useTimeline()

const { pushHistory } = useOperation()

const { keyboard } = useKeyboard()

const layerHeight = 50
const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => {
  const width = el.value?.parentElement?.getBoundingClientRect().width || 1
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length
  return width / timeline.value.scale / viewScale
})

const CUT_LEFT_PX = 50
const MIN_VISIBLE_WIDTH = 28 // border 4 * 2 + handle 8 * 2 + middle space 4

const hiddenWidth = ref(0)
const style = computed<CSSProperties>(() => {
  let left = (props.strip.start - timeline.value.start) * pixScale.value
  let width = props.strip.length * pixScale.value
  // console.log(left);
  if (left < -CUT_LEFT_PX) {
    width += left + CUT_LEFT_PX
    left = -CUT_LEFT_PX
  }

  if (width <= MIN_VISIBLE_WIDTH) {
    hiddenWidth.value = MIN_VISIBLE_WIDTH - width
    width = MIN_VISIBLE_WIDTH
  } else {
    hiddenWidth.value = 0
  }

  return {
    width: width + 'px',
    position: 'absolute',
    top: props.strip.layer * layerHeight + 1 + 'px',
    left: left + 'px'
  }
})

function drag (e: MouseEvent) {
  e.preventDefault()
  // block select rectangle
  e.stopPropagation()

  selectStripClick(props.strip)

  const parent = el.value?.parentElement
  const parentRect = parent?.getBoundingClientRect()
  if (!parentRect) { return }

  const startProps = {
    start: props.strip.start,
    length: props.strip.length,
    id: props.strip.id,
    layer: props.strip.layer
  }
  let startStart = startProps.start
  let finalProps = { ...startProps }

  const otherStrips = timeline.value.selectedStrips.filter(strip => strip.id !== props.strip.id)
  const otherStripsStart = otherStrips.map(strip => strip.start)

  onDragStart(
    e,
    (d, e) => {
      const layerIndex = Math.floor((e.clientY - parentRect.top) / layerHeight)
      if (layerIndex < 0) { return }
      startStart += d.x / pixScale.value
      finalProps = {
        id: startProps.id,
        layer: layerIndex,
        start: startStart,
        length: startProps.length + d.x / pixScale.value
      }
      moveStrip(
        finalProps.id,
        finalProps.start,
        finalProps.length,
        finalProps.layer
      )

      otherStrips.forEach((strip) => {
        moveStrip(
          strip.id,
          strip.start + d.x / pixScale.value,
          strip.length,
          strip.layer
        )
      })
    },
    () => {
      pushHistory(`MoveStrip: ${JSON.stringify(finalProps, null, 2)}`)
      undo.push(
        () => {
          pushHistory(`Undo MoveStrip: ${JSON.stringify(startProps, null, 2)}`)
          moveStrip(
            startProps.id,
            startProps.start,
            startProps.length,
            startProps.layer
          )
        },
        () => {
          pushHistory(`Redo MoveStrip: ${JSON.stringify(finalProps, null, 2)}`)
          moveStrip(
            finalProps.id,
            finalProps.start,
            finalProps.length,
            finalProps.layer
          )
        }
      )
    }
  )
}

function moveStart (e: MouseEvent) {
  e.stopPropagation()
  const firstEnd = props.strip.start + props.strip.length
  onDragStart(e, (d) => {
    const start = props.strip.start + d.x / pixScale.value
    if (start > firstEnd) { return }
    moveStrip(
      props.strip.id,
      start,
      props.strip.length - d.x / pixScale.value,
      props.strip.layer
    )
  })
}

function moveEnd (e: MouseEvent) {
  e.stopPropagation()
  onDragStart(e, (d) => {
    const length = props.strip.length + d.x / pixScale.value
    if (length < 0) { return }
    moveStrip(props.strip.id, props.strip.start, length)
  })
}

function getComponentNameFromStrip (strip: Strip) {
  for (let i = 0; i < strip.effects.length; i++) {
    const effect = strip.effects[i]
    if (effect.type === 'Text') {
      return 'PanelsTextStripUI'
    } else if (effect.type === 'Video') {
      return 'PanelsVideoStripUI'
    } else if (effect.type === 'Audio') {
      return 'PanelsAudioStripUI'
    }
    console.warn('unknown effect type', effect.type)
  }
}

function selectStripClick (strip: Strip) {
  if (keyboard.value.shift) {
    selectStrip(
      timeline.value.selectedStrips.map(s => s.id).concat([strip.id])
    )
  } else {
    selectStrip([strip.id])
  }
}
</script>

<template>
  <div
    ref="el"
    :style="style"
    class="strip"
    :class="
      timeline.selectedStrips.find((x) => x.id == props.strip.id)
        ? 'strip-selected'
        : ''
    "
    @mousedown="drag"
  >
    <div class="handle" @mousedown="moveStart" />
    <component :is="getComponentNameFromStrip(props.strip)" :strip="props.strip" />
    <div class="handle" style="right: 0" @mousedown="moveEnd" />
    <div
      class="absolute -right-[4px] -top-[4px] h-[49px]"
      style="background-color: rgba(0, 0, 0, 0.5)"
      :style="{
        width: hiddenWidth + 'px',
      }"
    />
  </div>
</template>

<style scoped>
.strip {
  background-color: var(--teal-200);
  border: 4px solid var(--teal-200);
  box-sizing: border-box;
  cursor: pointer;
  height: 48px;
}

.strip-selected {
  /* background-color: var(--teal-500); */
  border: 4px solid var(--teal-50);
  box-sizing: border-box;
}

.handle {
  position: absolute;
  top: 0;
  width: 8px;
  background-color: var(--teal-300);
  height: 100%;
  cursor: ew-resize;
  z-index: 1;
  user-select: none;
}
</style>
