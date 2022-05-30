<script setup lang="ts">
import { time } from 'console'
import KeyframeMarker from '../KeyframeMarker.vue'
import KeyframeSelectRect from '../KeyframeSelectRect.vue'
import { Animation } from '~~/src/core/TextStripEffect'
import { calcAnimationValue } from '~~/src/utils/calcAnimationValue'
import { StripEffect } from '~~/src/core/StripEffect'

const { timeline, updateEffect } = useTimeline()

const strip = computed(() => {
  if (timeline.value.selectedStrips.length > 0) {
    return timeline.value.selectedStrips[0]
  }
  return null
})

const keys = ref(new Map<string, Animation[]>())

const animationIdEffectIdMap = ref(new Map<string, StripEffect>())

const times = computed(() => [...Array(Math.floor(maxTime.value))].map((_, i) => i))
const start = ref(0)
const end = ref(1)

function update () {
  keys.value.clear()
  strip.value?.effects.forEach((effect) => {
    if ('animations' in effect) {
      effect.animations.forEach((animation) => {
        if (!keys.value.has(animation.key)) {
          keys.value.set(animation.key, [])
        }
        animationIdEffectIdMap.value.set(animation.id, { ...effect as StripEffect })
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
const pixPerSec = computed(() => {
  if (!strip.value) { return 1 }
  const rect = timeArea.value?.getBoundingClientRect()
  const width = rect?.width || 0
  return width / strip.value.length / (end.value - start.value)
})

const startOffset = computed(() => {
  if (!strip.value) { return 0 }
  const rect = timeArea.value?.getBoundingClientRect()
  const width = rect?.width || 0
  return -width * (start.value) / (end.value - start.value)
})

const maxTime = computed(() => {
  if (!strip.value) { return 0 }
  return strip.value.length
})

watch(strip, () => {
  update()
})

watch(
  () => [...(strip.value?.effects || [])],
  () => {
    update()
  }
)

const el = ref<HTMLElement | null>(null)
onMounted(() => {
  el.value?.addEventListener('keydown', (e) => {
    if (!strip.value) { return }
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

            if (!strip.value) { return }
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

</script>

<template>
  <div ref="el" class="flex h-full">
    <div class="h-full border-r-[1px] border-default">
      <div class="border-bottom-1 h-24">
        Properties
      </div>
      <div style="width: 150px; height: 100%">
        <div
          v-for="(key, i) in keys"
          :key="i"
          class="flex overflow-hidden whitespace-nowrap"
          style="
            box-sizing: border-box;
            border-bottom: 1px solid var(--border-grey);
          "
        >
          <div class="mr-4">
            {{ key[0] }} :
          </div>
          <v-input-base
            style="margin: auto"
            :value="calcAnimationValue(key[1], timeline.curent - strip!.start, key[0], 0)"
            readonly
          />
        </div>
      </div>
    </div>
    <div ref="timeArea" class="w-full h-full relative overflow-hidden select-none">
      <keyframe-select-rect />
      <div class="border-bottom-1 h-24 flex relative">
        <div
          v-for="i in times"
          :key="i"
          class="absolute border-l-[1px] border-default text-xs h-24 flex"
          :style="{ left: `${startOffset + i * pixPerSec}px` }"
        >
          <div class="mt-auto ml-2 mb-2">
            {{ i }}
          </div>
        </div>
      </div>
      <div
        v-for="(key, i) in keys"
        :key="i"
        class="flex relative"
        style="
          height: 25px;
          width: 100%;
          border-bottom: 1px solid var(--border-grey);
          box-sizing: border-box;
        "
      >
        <keyframe-marker
          v-for="(anim, j) in key[1]"
          :key="j"
          :animation="anim"
          :scale="pixPerSec"
          :left="startOffset"
          :effect="animationIdEffectIdMap.get(anim.id)"
          :strip-id="strip?.id || ''"
        />
      </div>
      <div class="absolute bottom-0 w-full">
        <scale-scroll :start="start" :end="end" @start="changeStart" @end="changeEnd" />
      </div>
    </div>
  </div>
</template>

<style>
</style>
