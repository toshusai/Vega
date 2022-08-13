<script setup lang="ts">
import shortUUID, { uuid } from 'short-uuid'
import { mdiCursorDefault } from '@mdi/js'
import ScaleScroll from '../ScaleScroll.vue'
import SelectRect from '../SelectRect.vue'
import { getScrollbarWidth } from '../../utils/getScrollbarWidth'
import TimeView from './TimeView.vue'
import TimelineCursor from './TimelineCursor.vue'
import { Strip } from '~~/src/core/Strip'
import { VideoStripEffect } from '~~/src/core/VideoStripEffect'
import { ImageStripEffect } from '~~/src/core/ImageStripEffect'
const {
  timeline,
  addStrip,
  removeStrips,
  selectStrip,
  changeView,
  play,
  update,
  changeTimelineTool
} = useTimeline()

const { assets } = useAssets()

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
      } else if (scrollTop.value > 50 * (layers.value.length - 1)) {
        scrollTop.value = 50 * (layers.value.length - 1)
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

  const forceResize = () => {
    // EPSILON for force update
    changeView(
      timeline.value.start + Number.EPSILON,
      timeline.value.end + Number.EPSILON
    )
  }

  addEventListener('resize', forceResize)
  window.addEventListener('resize', () => {
    changeView(
      timeline.value.start + Number.EPSILON,
      timeline.value.end + Number.EPSILON * 5
    )
  })
})

const layers = computed(() => {
  const l: Strip[][] = []
  for (const strip of timeline.value.strips) {
    if (l.length <= strip.layer) {
      for (let i = l.length; i <= strip.layer; i++) {
        l.push([])
      }
    }
    l[strip.layer].push(strip as Strip)
  }
  l.push([])
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

function mouseup () {
  if (clickMouseBehaviour.value) {
    selectStrip([])
  }
  clickMouseBehaviour.value = false
  if (!dummyStrip.value) {
    return
  }

  if (dad.value.key === 'assets') {
    const assetId = dad.value.payload
    if (!assetId) {
      dummyStrip.value = null
      return
    }
    const asset = assets.value.assets.find(a => a.id === assetId)
    console.warn('TODO add three.js object to scene')
    if (asset?.type === 'Video') {
      const ve: VideoStripEffect = {
        type: 'Video',
        videoAssetId: assetId,
        animations: [],
        id: uuid(),
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        start: 0,
        volume: 1
      }
      const newStrip: Strip = {
        effects: [ve],
        layer: 0,
        start: dummyStrip.value.start,
        length: dummyStrip.value.length,
        id: uuid()
      }

      addStrip(newStrip)
    } else if (asset?.type === 'Image') {
      const imageEffect: ImageStripEffect = {
        type: 'Image',
        imageAssetId: assetId,
        animations: [],
        id: uuid(),
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        opacity: 1
      }

      const newStrip: Strip = {
        effects: [imageEffect],
        layer: 0,
        start: dummyStrip.value.start,
        length: dummyStrip.value.length,
        id: uuid()
      }

      addStrip(newStrip)
    }
  }
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
  el.value?.addEventListener('mouseenter', () => {
    el.value?.focus()
  })
  el.value?.addEventListener('keydown', (e) => {
    if (e.key === 'x') {
      if (timeline.value.selectedStrips.length > 0) {
        removeStrips(timeline.value.selectedStrips.map(s => s.id))
      }
    }
  })
})

const scrollbarWidth = ref(getScrollbarWidth())

const dummyStrip = ref<Strip | null>()

function changeTool (tool: 'cursor' | 'cut') {
  changeTimelineTool(tool)
}
const pixScale = computed(() => {
  return usePixPerSecTimeline(timelineBox.value)
})
</script>

<template>
  <div ref="el" class="timeline-root" tabindex="0">
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
        <time-view
          :start="timeline.start"
          :length="timeline.end - timeline.start"
          style="width: calc(100% - 100px)"
          @move="t => update(t, true)"
        />
      </div>
      <div class="timeline-box" tabindex="0">
        <div
          style="
            border-right: 1px solid var(--border-grey);
            height: 100%;
            width: 30px;
          "
        >
          <div style="width: 30px; height: 30px; display: flex">
            <v-icons
              style="margin: auto"
              :path="mdiCursorDefault"
              :fill="timeline.timelineTool == 'cursor' ? `white` : 'gray'"
              @click="() => changeTool('cursor')"
            />
          </div>
          <!-- <div class="w-[30px] h-[30px] flex">
            <icons-scissors
              :fill="timeline.timelineTool == 'cut' ? `white` : 'gray'"
              @click="() => changeTool('cut')"
            />
          </div> -->
        </div>

        <div
          style="
            border-right: 1px solid var(--border-grey);
            height: 100%;
            width: 70px;
          "
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
          @mouseup="mouseup"
          @mousedown="mousedown"
          @mousemove="mousemove"
        >
          <timeline-cursor
            :style="{
              left: (timeline.curent - timeline.start) * pixScale + 'px'
            }"
          />
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
          style="
            border-right: 1px solid var(--border-grey);
            width: 100px;
            min-width: 100px;
          "
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
  outline: none;
}

.timeline-box {
  display: flex;
  position: relative;
  height: calc(100% - 32px);
  overflow: hidden;
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
