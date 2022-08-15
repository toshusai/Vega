<script setup lang="ts">
import { Chrome } from '@ckpack/vue-color'
import { mdiPalette } from '@mdi/js'

const props = defineProps<{
  value: number | string
}>()

const emit = defineEmits<{(e: 'updateColor', value: string): void }>()

function changeColor (c: { hex8: string }) {
  emit('updateColor', c.hex8)
}

const isOpenPicker = ref(false)
const left = ref(0)
const top = ref(0)
const el = ref<HTMLElement | null>(null)
function closePicker (e: MouseEvent, force = false) {
  if (!force && el.value?.parentElement?.contains(e.target as HTMLElement)) {
    return
  }
  isOpenPicker.value = false
  window.removeEventListener('pointerdown', closePicker)
}
function openPicker (e: MouseEvent) {
  if (isOpenPicker.value) {
    closePicker(e, true)
    return
  }
  isOpenPicker.value = true
  const rect = el.value?.getBoundingClientRect()
  if (rect) {
    left.value = rect.left + rect.width + 8
    top.value = rect.top
  }
  e.stopPropagation()
  window.addEventListener('pointerdown', closePicker)
}
const colors = computed(() => {
  return props.value.toString()
})

/**
 * Expect color to be hex8
 */
function validColor (color: string) {
  return color.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/i)
}

const invalid = computed(() => {
  return !validColor(props.value.toString())
})

function changeColorByInputEvent (e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('updateColor', value)
}
</script>

<template>
  <div style="display: flex; width: 100%">
    <v-input-base
      v-bind="$attrs"
      :value="value"
      :invalid="invalid"
      @input="changeColorByInputEvent"
    />
    <div style="display: flex; position: relative; cursor: pointer">
      <v-icons
        ref="el"
        :path="mdiPalette"
        style="
          margin: auto 4px;
          border-radius: 4px;
          border: 1px solid var(--border-grey);
          width: 16px;
          height: 16px;
          user-select: none;
        "
        viewBox="0 0 24 24"
        fill="currentColor"
        @click="openPicker"
      />

      <div
        v-if="isOpenPicker"
        :style="{
          left: `${left}px`,
          top: `${top}px`,
          position: 'fixed',
          zIndex: '10'
        }"
      >
        <chrome :model-value="colors" @update:model-value="changeColor" />
      </div>
    </div>
  </div>
</template>

<!--

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
            />
          </svg>
        </button>

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
            />
          </svg>
        </button>

 -->
