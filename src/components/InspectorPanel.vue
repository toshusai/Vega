<script setup lang="ts">
import { uuid } from 'short-uuid'
import { PluginStripEffect, Strip, StripEffect } from '@/core'
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

/**
 * mouse up on inspector panel
 *
 * it can add new effects
 */
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
        const newPluginEffect: PluginStripEffect = {
          id: uuid(),
          type: asset.name,
          animations: []
        }
        const newStrip = {
          ...strip.value,
          effects: [
            ...(strip.value?.effects || []),
            newPluginEffect
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
    <div v-for="effect in strip.effects" :key="effect.id">
      <inspector-container :strip="strip" :effect="effect">
        <component :is="getComponentName(effect)" :strip="strip" :effect="effect" />
      </inspector-container>
    </div>
  </div>
</template>
