<script setup lang="ts">
import { uuid } from 'short-uuid'
import { Strip } from '@//core/Strip'
import { StripEffect } from '@/core/stripEffect'
const { init, timeline, updateStrip, selectStrip } = useTimeline()
const { dad } = useDragAndDrop()
const { assets } = useAssets()

const strip = computed(() => {
  return timeline.value.selectedStrips[0] as Strip | null
})

function getComponentName (effect: StripEffect) {
  return `${effect.type.toLowerCase()}-strip-inspector`
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare function require(args: string[], cb: (result: unknown) => void): void;

function mouseup () {
  if (dad.value.key === 'assets') {
    const assetId = dad.value.payload
    if (!assetId) {
      return
    }
    const asset = assets.value.assets.find(a => a.id === assetId)
    if (asset?.type !== 'Plugin') {
      return
    }
    require([asset.path], () => {
      require([asset.name], (result: any) => {
        const newStrip = {
          ...strip.value,
          effects: [
            ...(strip.value?.effects || []),
            {
              id: uuid(),
              type: 'Plugin',
              name: asset.name,
              animations: []
            }
          ]
        } as Strip
        constructorMap[asset.name] = result.default
        updateStrip(newStrip)
        selectStrip([newStrip.id])
        init()
      })
    })
  }
}

</script>

<template>
  <div v-if="strip" style="height: 100%; overflow-y: scroll; padding-right: 16px;" @pointerup="mouseup">
    <component
      :is="getComponentName(effect)"
      v-for="effect in strip.effects"
      :key="effect.id"
      :strip="strip"
      :effect="effect"
    />
  </div>
</template>
