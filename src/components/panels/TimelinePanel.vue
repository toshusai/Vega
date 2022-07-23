<script setup lang="ts">
import shortUUID, { uuid } from 'short-uuid'
import ScaleScroll from '../ScaleScroll.vue'
import SelectRect from '../SelectRect.vue'
import { getScrollbarWidth } from '../../utils/getScrollbarWidth'
import TimeView from './TimeView.vue'
import Cursor from './Cursor.vue'
import TimelineCursor from './TimelineCursor.vue'
import { Strip } from '~~/src/core/Strip'
import { Timeline } from '~~/src/core/Timeline'
const { timeline, selectStrip, changeView, play, update, changeTimelineTool } =
  useTimeline()

const { addUpdate } = useUpdate()

const { addEventListener } = useContainer()

const { dad } = useDragAndDrop()

const el = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!el.value) {
    return
  }
  el.value.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      const zoomSize = e.deltaY * 0.01
      const start = timeline.value.start - zoomSize
      const end = timeline.value.end + zoomSize
      changeView(start, end)
    } else {
      scrollTop.value += e.deltaY
      if (scrollTop.value < 0) {
        scrollTop.value = 0
      }
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
const strips = computed<{ strip: Strip; id: string }[]>(() => {
  return timeline.value.strips.map((s) => {
    return {
      strip: s as Strip,
      id: uuid()
    }
  })
})

const clickMouseBehaviour = ref(false)

const scrollTop = ref(0)

function mousedown () {
  clickMouseBehaviour.value = true
}

function mousemove (e: MouseEvent) {
  if (!timelineBox.value) {
    return
  }
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
    if (!leftBox.value) {
      return
    }

    leftBox.value.scrollTop = timelineBox.value?.scrollTop || 0
  })
})

const scrollbarWidth = ref(getScrollbarWidth())

const dummyStrip = ref<Strip | null>()

function changeTool (tool: 'cursor' | 'cut') {
  changeTimelineTool(tool)
}
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
    <div
      ref="timelineBody"
      style="width: calc(100%); position: relative; overflow: hidden"
    >
      <div style="display: flex; height: 20px">
        <div
          style="
            width: 100px;
            border-bottom: 1px solid white;
            border-right: 1px solid white;
          "
        />
        <time-view style="width: calc(100% - 100px)" />
      </div>
      <div class="timeline-box">
        <div
          style="
            border-right: 1px solid var(--border-grey);
            height: 100%;
            width: 30px;
          "
        >
          <div style="width: 30px; height: 30px; display: flex">
            <svg
              style="width: 20px; height: 20px; margin: auto; cursor: pointer"
              viewBox="0 0 24 24"
              @click="() => changeTool('cursor')"
            >
              <path
                :fill="timeline.timelineTool == 'cursor' ? `white` : 'gray'"
                d="M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z"
              />
            </svg>
          </div>
          <div class="w-[30px] h-[30px] flex">
            <svg
              style="width: 20px; height: 20px; margin: auto; cursor: pointer"
              viewBox="0 0 24 24"
              @click="() => changeTool('cut')"
            >
              <path
                :fill="timeline.timelineTool == 'cut' ? `white` : 'gray'"
                d="M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z"
              />
            </svg>
          </div>
        </div>

        <div
          style="border-right: 1px solid var(--border-grey); height: 100%; width: 70px"
        >
          <div
            v-for="(layer, i) in layers"
            :key="i"
            :style="`
            border-bottom: 1px solid var(--border-grey);
            height: 50px;
            box-sizing: content-box;
            position: absolute;
            width: 100px;
            top: ${i * 50 - scrollTop}px;
          `"
          />
        </div>
        <div
          ref="timelineBox"
          :style="`width: calc(100% - ${100}px); overflow-x: clip; display: flex; position: relative; height: 100%`"
          @mouseup="unselect"
          @mousedown="mousedown"
          @mousemove="mousemove"
        >
          <timeline-cursor />
          <select-rect v-if="timelineBox" :element="timelineBox" />
          <div
            v-for="(layer, i) in layers"
            :key="i"
            :strips="layer"
            class="layer"
            :style="`top: ${i * 50 - scrollTop}px`"
          />
          <panels-strip-ui
            v-for="strip in strips"
            :key="strip.id"
            :strip="strip.strip"
            :top="scrollTop"
          />
          <panels-strip-ui v-if="dummyStrip" key="dummy" :strip="dummyStrip" />
        </div>
      </div>
      <div class="flex">
        <div
          style="border-right: 1px solid var(--border-grey); width: 100px; min-width: 100px;"
        />
        <scale-scroll
          style="position: relative; bottom: 0"
          :start="timeline.start / timeline.length"
          :end="timeline.end / timeline.length"
          @start="n => changeView(n * timeline.length, timeline.end)"
          @end="n => changeView(timeline.start, n * timeline.length)"
        />
      </div>
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
