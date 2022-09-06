<script setup lang="ts">
import KeyframeMarker from './KeyframeMarker.vue'
import KeyframeSelectRect from './KeyframeSelectRect.vue'
import { StripEffect, calcAnimationValue, Animation } from '@/core'

const { timeline, updateEffect, update } = useTimeline()
const { addEventListener } = useContainer()

const strip = computed(() => {
  if (timeline.value.selectedStrips.length > 0) {
    return timeline.value.selectedStrips[0]
  }
  return null
})

const keys = ref(new Map<string, Animation[]>())

const animationIdEffectIdMap = ref(new Map<string, StripEffect>())

const times = computed(() => {
  // 1秒間隔
  // length
  let pps = pixPerSec.value
  let span = 1
  while (pps < 30) {
    span = span * 2
    pps = pixPerSec.value * span
  }
  if (!strip.value) { return [] }

  const length = Math.ceil((end.value - start.value) * (strip.value?.length || 0))
  const startPx = start.value * strip.value.length * pixPerSec.value
  return [...Array(length)].map((_, i) => i * span * pixPerSec.value - startPx % (span * pixPerSec.value))
})
const start = ref(0)
const end = ref(1)

function updateKeys () {
  keys.value.clear()
  strip.value?.effects.forEach((effect) => {
    if ('animations' in effect) {
      effect.animations.forEach((animation) => {
        if (!keys.value.has(animation.key)) {
          keys.value.set(animation.key, [])
        }
        animationIdEffectIdMap.value.set(animation.id, {
          ...(effect as StripEffect)
        })
        keys.value.get(animation.key)?.push(animation)
      })
    }
  })

  // create new map and set key order by name
  const sortedKeys = new Map<string, Animation[]>()
  const mapKeys = [...keys.value.keys()]
  mapKeys.sort((a, b) => a.localeCompare(b))
  mapKeys.forEach((key) => {
    sortedKeys.set(key, keys.value.get(key) || [])
  })
  keys.value = sortedKeys
}

const timeArea = ref<HTMLDivElement | null>(null)
const pixPerSec = computed(() => usePixPerSec(timeArea.value, (end.value - start.value) * (strip.value?.length || 0)))

function resize () {
  updateStartOffset()
}
onUpdated(resize)

const startOffset = ref(0)
function updateStartOffset () {
  if (!strip.value) {
    startOffset.value = 0
    return
  }
  const rect = timeArea.value?.getBoundingClientRect()
  const width = rect?.width || 0
  startOffset.value = (-width * start.value) / (end.value - start.value)
}

const maxTime = computed(() => {
  if (!strip.value) {
    return 0
  }
  return strip.value.length
})

watch(strip, () => {
  updateKeys()
})

watch(
  () => [...(strip.value?.effects || [])],
  () => {
    updateKeys()
  }
)

const el = ref<HTMLElement | null>(null)
onMounted(() => {
  addEventListener('resize', resize)
  window.addEventListener('resize', resize)
  el.value?.addEventListener('keydown', (e) => {
    if (!strip.value) {
      return
    }
    if (e.key === 'x') {
      strip.value.effects.filter((effect) => {
        if ('animations' in effect) {
          const newAnimationIds: Animation[] = []
          effect.animations.forEach((animation) => {
            timeline.value.selectedKeyframes.forEach((keyframe) => {
              if (animation.id !== keyframe.id) {
                newAnimationIds.push({ ...animation })
              }
            })

            if (!strip.value) {
              return
            }
            updateEffect(strip.value.id, {
              ...effect,
              animations: newAnimationIds
            })
          })
        }
        return true
      })
    }
  })
})

function changeStart (s: number) {
  start.value = s
}

function changeEnd (e: number) {
  end.value = e
}

function updateTime (t: number) {
  if (!strip.value) {
    return
  }
  update(strip.value.start + t, true)
}
</script>

<template>
  <div v-if="strip" ref="el" style="display: flex; height: 100%">
    <div style="height: 100%; border-right: solid 1px white">
      <div style="border-bottom: 1px solid; height: 20px">
        Properties
      </div>
      <div style="width: 200px; height: 100%">
        <div
          v-for="(key, i) in keys"
          :key="i"
          style="
            display: flex;
            overflow: hidden;
            height: 20px;
            white-space: nowrap;
            box-sizing: border-box;
            border-bottom: 1px solid var(--border-grey);
          "
        >
          <div style="margin: auto 4px">
            {{ key[0] }}:
          </div>
          <v-input-base
            style="margin: 2px 4px 2px auto"
            :value="calcAnimationValue(key[1], timeline.curent - strip!.start, key[0], 0).toFixed(3)"
            readonly
          />
        </div>
      </div>
    </div>
    <div
      ref="timeArea"
      style="
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
        user-select: none;
      "
    >
      <div style="position: relative; height: calc(100% - 12px)">
        <keyframe-select-rect />
        <div
          style="
            display: flex;
            position: relative;
            height: 20px;
            border-bottom: 1px solid;
          "
        >
          <time-view
            :start="start * strip.length"
            :length="(end - start) * strip.length"
            @move="updateTime"
          />
        </div>
        <timeline-cursor
          :style="{
            left:
              (timeline.curent - strip.start - start * strip.length) *
              pixPerSec +
              'px'
          }"
        />

        <div
          v-for="px in times"
          :key="px"
          :style="{ left: `${px}px` }"
          style="
            display: flex;
            position: absolute;
            height: 100%;
            border-left: 1px solid var(--bg2);
          "
        />

        <div
          v-for="(key, i) in keys"
          :key="i"
          style="
            dislplay: flex;
            position: relative;
            height: 24px;
            width: 100%;
            border-bottom: 1px solid var(--bg2);
            box-sizing: border-box;
          "
        >
          <keyframe-marker
            v-for="anim in key[1]"
            :key="anim.id"
            :animation="anim"
            :scale="pixPerSec"
            :left="startOffset"
            :effect="animationIdEffectIdMap.get(anim.id)"
            :strip-id="strip?.id || ''"
          />
        </div>
      </div>
      <div style="position: absolute; bottom: 0; width: 100%">
        <scale-scroll
          :start="start"
          :end="end"
          @start="changeStart"
          @end="changeEnd"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
