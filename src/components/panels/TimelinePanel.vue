<script setup lang="ts">
import shortUUID, { uuid } from 'short-uuid'
import ScaleScroll from '../ScaleScroll.vue'
import SelectRect from '../SelectRect.vue'
import TimeView from './TimeView.vue'
import Cursor from './Cursor.vue'
import TimelineCursor from './TimelineCursor.vue'
import { Strip } from '~~/src/core/Strip'
const { timeline, selectStrip, changeView, play, update } = useTimeline()

const { addUpdate } = useUpdate()

const { addEventListener } = useContainer()

const { dad } = useDragAndDrop()

const el = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!el.value) { return }
  el.value.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      const zoomSize = e.deltaY * 0.01
      const start = timeline.value.start - zoomSize
      const end = timeline.value.end + zoomSize
      changeView(start, end)
    }

    const scale = 0.01
    const start = timeline.value.start + e.deltaX * scale
    if (start < 0) {
      changeView(0, timeline.value.end)
      return
    }
    const end = timeline.value.end + e.deltaX * scale
    if (end > timeline.value.length) {
      changeView(timeline.value.start, timeline.value.length)
      return
    }
    changeView(start, end)
  })
  addUpdate((d) => {
    if (timeline.value.isPlay) {
      update(timeline.value.curent + d / 1000)
    } else {
      update(timeline.value.curent)
    }
  })
  window.addEventListener('keydown', (e) => {
    if (document.activeElement?.tagName === 'INPUT') {
      return
    }
    if (e.key === ' ') {
      play(!timeline.value.isPlay)
    }
  })

  addEventListener('resize', () => {
    // 強制的に更新するためEPSILONを足す
    changeView(
      timeline.value.start + Number.EPSILON,
      timeline.value.end + Number.EPSILON
    )
  })
})

const layers = computed(() => {
  const l: Strip[][] = [[], [], [], []]
  for (const strip of timeline.value.strips) {
    if (l.length <= strip.layer) {
      for (let i = l.length; i <= strip.layer; i++) {
        l.push([])
      }
    }
    l[strip.layer].push(strip as Strip)
  }
  return l
})

/**
 * BAD: 渡すStripのwatchを有効にするためにuuidをつける
 */
const strips = computed<{ strip: Strip, id: string }[]>(() => {
  return timeline.value.strips.map((s) => {
    return {
      strip: s as Strip,
      id: uuid()
    }
  })
})

const clickMouseBehaviour = ref(false)

function mousedown () {
  clickMouseBehaviour.value = true
}

function mousemove (e: MouseEvent) {
  if (!timelineBox.value) { return }
  clickMouseBehaviour.value = false
  const rect = timelineBox.value.getBoundingClientRect()
  const visibleSec = timeline.value.end - timeline.value.start
  const secPerPx = visibleSec / rect.width

  if (dad.value.key === 'assets') {
    dummyStrip.value = {
      effects: [],
      layer: 0,
      start: (e.clientX - rect.left) * secPerPx + timeline.value.start,
      length: 1,
      id: 'x'
    }
  }
}

function unselect () {
  if (clickMouseBehaviour.value) {
    selectStrip([])
  }
  clickMouseBehaviour.value = false

  dummyStrip.value = null
}

const timelineBody = ref<HTMLElement | null>(null)

const leftBox = ref<HTMLElement | null>(null)
const timelineBox = ref<HTMLElement | null>(null)

onMounted(() => {
  timelineBox.value?.addEventListener('scroll', () => {
    if (!leftBox.value) { return }

    leftBox.value.scrollTop = timelineBox.value?.scrollTop || 0
  })

  getScrollbarWidth()
})

const scrollbarWidth = ref(0)
function getScrollbarWidth () {
  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  // outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  scrollbarWidth.value = (outer.offsetWidth - inner.offsetWidth)
}

const dummyStrip = ref<Strip | null>()
</script>

<template>
  <div ref="el" class="timeline-root">
    <!-- <div style="width: 100px; border-right: 1px solid var(--border-grey)">
      <div
        style="
          height: 20px;
          border-bottom: 1px solid var(--border-grey);
          box-sizing: border-box;
        "
      />
      <div ref="leftBox" class="timeline-box" style="overflow: hidden;">
        <div
          v-for="(layer, i) in layers"
          :key="i"
          :style="`
        border-bottom: 1px solid var(--border-grey);
        height: 50px;
        box-sizing: content-box;
        position: absolute;
        width: 100px;
        top: ${i * 50}px;
      `"
        />
      </div>
    </div> -->
    <div ref="timelineBody" style="width: calc(100% ); position: relative; overflow: hidden">
      <TimelineCursor />
      <div class="flex h-[20px]">
        <div style="width: 100px" />
        <TimeView style="width: calc(100% - 100px)" />
      </div>
      <div class="flex h-full timeline-box">
        <div class="f-full w-[100px]" style="border-right: 1px solid var(--border-grey)">
          <div
            v-for="(layer, i) in layers"
            :key="i"
            :style="`
            border-bottom: 1px solid var(--border-grey);
            height: 50px;
            box-sizing: content-box;
            position: absolute;
            width: 100px;
            top: ${i * 50}px;
          `"
          />
        </div>
        <div
          ref="timelineBox"
          class="flex relative h-full overflow-hidden"
          :style="`width: calc(100% - ${100}px);`"
          @mouseup="unselect"
          @mousedown="mousedown"
          @mousemove="mousemove"
        >
          <SelectRect v-if="timelineBox" :element="timelineBox" />
          <div v-for="(layer, i) in layers" :key="i" :strips="layer" class="layer" :style="`top: ${i * 50}px`" />
          <PanelsStripUI v-for="(strip, ) in strips" :key="strip.id" :strip="strip.strip" />
          <PanelsStripUI v-if="dummyStrip" key="dummy" :strip="dummyStrip" />
        </div>
      </div>
      <ScaleScroll
        style="position: absolute; bottom: 0"
        :start="timeline.start / timeline.length"
        :end="timeline.end / timeline.length"
        @start="(n) => changeView(n * timeline.length, timeline.end)"
        @end="(n) => changeView(timeline.start, n * timeline.length)"
      />
    </div>
  </div>
</template>

<style scoped>
.timeline-root {
  display: flex;
  overflow: hidden;
  height: 100%;
  position: relative;
  user-select: none;
}

.timeline-box {
  display: flex;
  position: relative;
  height: calc(100% - 40px);
  /* 20px(TimeView) 20px(ScaleScroll */
  overflow-y: scroll;
  overflow-x: hidden;
}

.layer {
  display: flex;
  width: 100%;
  position: absolute;
  height: 50px;
  border-bottom: 1px solid var(--grey-500);
  box-sizing: content-box;
}
</style>
