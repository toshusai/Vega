<script setup lang="ts">
import { mdiDelete, mdiMenuDown } from '@mdi/js'
import { getCache, setCache } from './inspectorContainerCache'
import { Strip, StripEffect } from '@/core'

const props = defineProps<{ effect: StripEffect, strip: Strip }>()

const open = ref(getCache(props.effect.id))

const { updateStrip, selectStrip } = useTimeline()

const canDelete = computed(() => {
  return props.effect.type !== 'Video' && props.effect.type !== 'Auido' && props.effect.type !== 'Text'
})

const deleteEffect = () => {
  const newStrip = {
    ...props.strip,
    effects: props.strip.effects.filter(e => e.id !== props.effect.id)
  }
  updateStrip(newStrip)
  selectStrip([newStrip.id])
}

const toggleOpen = () => {
  open.value = !open.value
  setCache(props.effect.id, open.value)
}

</script>

<template>
  <div>
    <div style="display: flex; width: 100%; stroke: white; padding: 0; margin: 4px; height: 16px;">
      <div style="display: flex;">
        <div>
          {{ effect.type }}
        </div>
        <button
          v-if="canDelete"
          style="height: 12px; width: 12px; margin: auto 4px; padding: 0"
          @click="deleteEffect"
        >
          <v-icons :size="12" :path="mdiDelete" />
        </button>
      </div>
      <button
        style="margin-left: auto; height: 16px"
        :style="{
          transform: open ? `rotate(180deg)` : ``
        }"
        @click="toggleOpen"
      >
        <v-icons :size="16" :path="mdiMenuDown" />
      </button>
    </div>
    <template v-if="open">
      <slot />
    </template>
  </div>
</template>

<style scoped>
</style>
