<script setup lang="ts">
import { StripEffect } from '../core/StripEffect'
import { Animation } from '../core/TextStripEffect'
import { onDragStart } from '../utils/onDragStart'

const props = defineProps<{ animation: Animation; scale: number, left: number, stripId: string, effect?: StripEffect }>()

const { timeline, selectKeyframe, updateEffect, getFisrtSelectedStrip } = useTimeline()

const HEIGHT = 24
const SIZE = 12

const style = computed(() => {
  return {
    top: `${HEIGHT / 2 - SIZE / 2}px`,
    left: `${props.left + props.animation.time * props.scale - SIZE / 2}px`
  }
})

const selected = computed(() => {
  return timeline.value.selectedKeyframes.includes(props.animation)
})

const clickDown = ref(false)
function select () {
  if (clickDown.value) {
    selectKeyframe([props.animation])
  }
  clickDown.value = false
}

function mousedown (e: MouseEvent) {
  e.stopPropagation()
  clickDown.value = true
  onDragStart(e, (_, e) => {
    if (!props.effect) { return }
    clickDown.value = false
    if (!timeline.value.selectedKeyframes.find(x => x.id === props.animation.id)) {
      // if (keyboard.keyboard.value.shift) {

      // }
      selectKeyframe([props.animation])
    }

    const deltaX = e.movementX

    const selectedStrip = getFisrtSelectedStrip()
    if (!selectedStrip) { return }
    const otherSelectedAnimationIds = timeline.value.selectedKeyframes.filter(a => a.id !== props.animation.id).map(a => a.id)

    const newEffect = { ...props.effect, animations: props.effect.animations.map(x => ({ ...x })) }
    newEffect.animations.forEach((a) => {
      if (a.id === props.animation.id || otherSelectedAnimationIds.includes(a.id)) {
        a.time += deltaX / props.scale
      }
    })
    updateEffect(props.stripId, newEffect)

    // reselect other animations
    const otherSelectedAnimations: Animation[] = []
    newEffect.animations.forEach((a) => {
      if (otherSelectedAnimationIds.includes(a.id)) {
        otherSelectedAnimations.push(a)
      }
    })

    selectKeyframe([newEffect.animations.find(x => x.id === props.animation.id) as Animation,
      ...otherSelectedAnimations
    ])
  })
}

const keyboard = useKeyboard()

</script>

<template>
  <div :id="animation.id" :style="style" class="keyframe-marker cursor-pointer">
    <svg
      :class="selected ? `selected` : ``"
      :style="`width: ${SIZE}px; height: ${SIZE}px`"
      viewBox="0 0 24 24"
      @mouseup="select"
      @mousedown="mousedown"
    >
      <path
        d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.keyframe-marker {
  position: absolute;
  margin: auto 0;
  fill: currentColor;
}

.selected {
  fill: orange;
}
</style>
