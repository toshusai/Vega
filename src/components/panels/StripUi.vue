<script setup lang="ts">
import { CSSProperties, PropType } from 'vue'
import { Strip } from '~~/src/core/Strip'
import undo from '~~/src/core/Undo'
import { clone } from '~~/src/utils/clone'
import { onDragStart } from '~~/src/utils/onDragStart'
import { snap } from '~~/src/utils/snap'
const props = defineProps({
  strip: {
    type: Object as PropType<Strip>,
    required: true
  },
  top: {
    default: 0,
    type: Number
  }
})

const { timeline, moveStrip, selectStrip } = useTimeline()

const { pushHistory } = useOperation()

const { keyboard } = useKeyboard()

const layerHeight = 50
const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => usePixPerSecTimeline(el.value?.parentElement))

const CUT_LEFT_PX = 50
const MIN_VISIBLE_WIDTH = 28 // border 4 * 2 + handle 8 * 2 + middle space 4

const hiddenWidth = ref(0)
const style = computed<CSSProperties>(() => {
  let left = (props.strip.start - timeline.value.start) * pixScale.value
  let width = props.strip.length * pixScale.value
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
    top: props.strip.layer * layerHeight + 1 - props.top + 'px',
    left: left + 'px'
  }
})

const clickEvent = ref(false)

function drag (e: MouseEvent) {
  e.preventDefault()
  // block select rectangle
  e.stopPropagation()

  const parent = el.value?.parentElement
  const parentRect = parent?.getBoundingClientRect()
  if (!parentRect) {
    return
  }

  const startProps = {
    start: props.strip.start,
    length: props.strip.length,
    id: props.strip.id,
    layer: props.strip.layer
  }
  const startStart = startProps.start
  let finalProps = { ...startProps }

  let otherStrips = timeline.value.selectedStrips.filter(
    strip => strip.id !== props.strip.id
  )
  const otherStartStrips = otherStrips.map(strip => clone(strip))

  clickEvent.value = true

  onDragStart(
    e,
    (_, e, sd) => {
      // 自分が選択されていないで他に選択中のストリップがあったら自分だけ選択する
      // 複数選択なら自分を加える
      if (!timeline.value.selectedStrips.find(s => s.id === props.strip.id)) {
        if (!keyboard.value.shift) {
          otherStrips = []
        }
        selectStripClick(props.strip)
      }
      clickEvent.value = false
      const layerIndex = Math.floor(
        (e.clientY - parentRect.top + props.top) / layerHeight
      )
      if (layerIndex < 0) {
        return
      }
      finalProps = {
        id: startProps.id,
        layer: layerIndex,
        start: startStart + sd.x / pixScale.value,
        length: startProps.length
      }
      moveStrip(
        finalProps.id,
        finalProps.start,
        finalProps.length,
        finalProps.layer
      )

      otherStrips.forEach((strip, i) => {
        const diff = -startProps.layer + otherStartStrips[i].layer
        moveStrip(
          strip.id,
          otherStartStrips[i].start + sd.x / pixScale.value,
          strip.length,
          layerIndex + diff
        )
      })
    },
    () => {
      if (clickEvent.value) {
        selectStripClick(props.strip)
        return
      }
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
  const ss = props.strip.start
  const sl = props.strip.length
  onDragStart(e, (d, _, sd) => {
    const diff = snap(sd.x / pixScale.value)
    const start = ss + diff
    if (start > firstEnd) {
      return
    }
    moveStrip(
      props.strip.id,
      start,
      sl - diff,
      props.strip.layer
    )
  })
}

function moveEnd (e: MouseEvent) {
  e.stopPropagation()
  const sl = props.strip.length
  onDragStart(e, (_, __, sd) => {
    const length = sl + sd.x / pixScale.value
    if (length < 0) {
      return
    }
    moveStrip(props.strip.id, props.strip.start, length)
  })
}

function getComponentNameFromStrip (strip: Strip) {
  for (let i = 0; i < strip.effects.length; i++) {
    const effect = strip.effects[i]
    if (effect.type === 'Text') {
      return 'panels-text-strip-ui'
    } else if (effect.type === 'Video') {
      return 'panels-video-strip-ui'
    } else if (effect.type === 'Audio') {
      return 'panels-audio-strip-ui'
    } else if (effect.type === 'Image') {
      return 'panels-image-strip-ui'
    }
    // eslint-disable-next-line no-console
    console.warn('unknown effect type', effect.type)
  }
}

function selectStripClick (strip: Strip) {
  if (keyboard.value.shift) {
    selectStrip(timeline.value.selectedStrips.map(s => s.id).concat([strip.id]))
  } else {
    selectStrip([strip.id])
  }
}
</script>

<template>
  <div
    :id="'strip-' + strip.id"
    ref="el"
    :style="style"
    class="strip"
    :class="
      timeline.selectedStrips.find(x => x.id === props.strip.id)
        ? 'strip-selected'
        : ''
    "
    @mousedown="drag"
  >
    <component :is="getComponentNameFromStrip(props.strip)" :strip="props.strip" />
    <div class="handle" @mousedown="moveStart" />
    <div class="handle" style="right: 0" @mousedown="moveEnd" />
    <div
      style="
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        right: -4px;
        top: -4px;
        height: 49px;
      "
      :style="{
        width: hiddenWidth + 'px'
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
  overflow: hidden;
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
  /* z-index: 1; */
  user-select: none;
}
</style>
