<script setup lang="ts">
import { CSSProperties } from 'vue'
import { uuid } from 'short-uuid'
import { TextStripEffectObject } from '../core/TextStripEffectObject'
import { VideoStripEffectObject } from '../core/VideoStripEffectObject'
import { calcAnimationValue } from '../utils/calcAnimationValue'
import { onDragStart } from '../utils/onDragStart'
import { setAnimation } from '../utils/setAnimation'

const { timeline, updateEffect } = useTimeline()

const props = defineProps<{ scale: number }>()

const strip = computed(() => timeline.value.selectedStrips[0])
const effect = computed(() => strip.value && strip.value.effects[0])
const style = ref<CSSProperties>({})
function updateStyle (): CSSProperties {
  if (!effect.value) { return { display: 'none' } }
  const width = timeline.value.width
  const height = timeline.value.height

  if (isText(effect.value)) {
    const obj = effectObjectMap.get(effect.value.id)
    if (!(obj instanceof TextStripEffectObject)) { return { display: 'none' } }

    const x = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent - strip.value.start,
      'position.x',
      effect.value.position.x
    )

    const y = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent - strip.value.start,
      'position.y',
      effect.value.position.y
    )

    return {
      left: (width / 2 + x - obj.mesureWidth / 2) * props.scale + 'px',
      bottom: (height / 2 + y - obj.mesureHeight / 2) * props.scale + 'px',
      width: obj.mesureWidth * props.scale + 'px',
      height: obj.mesureHeight * props.scale + 'px'
    }
  } else if (isVideo(effect.value)) {
    const obj = effectObjectMap.get(effect.value.id)
    if (!(obj instanceof VideoStripEffectObject)) { return { display: 'none' } }

    const x = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent,
      'position.x',
      effect.value.position.x
    )

    const y = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent,
      'position.y',
      effect.value.position.y
    )

    const videoW = obj.video.videoWidth
    const videoH = obj.video.videoHeight

    return {
      left: (width / 2 + x - obj.video.videoWidth / 2) * props.scale + 'px',
      bottom: (height / 2 + y - videoH / 2) * props.scale + 'px',
      width: videoW * props.scale + 'px',
      height: videoH * props.scale + 'px'
    }
  }
  return { display: 'none' }
}

onMounted(() => {
  const update = () => {
    style.value = updateStyle()
    window.requestAnimationFrame(update)
  }
  update()
})

function drag (e: MouseEvent) {
  onDragStart(e, (delta) => {
    if (isText(effect.value) || isVideo(effect.value)) {
      const newE = {
        ...effect.value,
        animations: [...effect.value.animations]
      }
      const p = {
        x: newE.position.x + delta.x / props.scale,
        y: newE.position.y - delta.y / props.scale,
        z: newE.position.z
      }

      if (
        effect.value.animations.filter(a => a.key == 'position.x').length == 0
      ) {
        newE.position = p
      } else {
        p.x =
          calcAnimationValue(
            newE.animations,
            timeline.value.curent - strip.value.start,
            'position.x'
          ) +
          delta.x / props.scale
        newE.animations = setAnimation(newE.animations, {
          id: uuid(),
          key: 'position.x',
          value: p.x,
          time: timeline.value.curent - strip.value.start - 0.01
        })
        // setAnimation(newE.animations, {
        //   key: "position.y",
        //   value: p.y,
        //   time: timeline.value.curent,
        // });
      }

      newE.position = p

      updateEffect(strip.value.id, {
        ...newE
      })
    }
  })
}
</script>

<template>
  <div
    class="gizmo text-brand absolute cursor-pointer"
    :style="style"
    @pointerdown="drag"
  />
</template>

<style scoped>
.gizmo {
  border: 1px solid red;
  user-select: none;
  /* box-sizing: border-box; */
  /* box-sizing: content-box; */
}
</style>
