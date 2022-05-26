<script setup lang="ts">
import { Chrome } from '@ckpack/vue-color'

const props = defineProps<{
  value: number | string;
}>()

const emit = defineEmits<{
  (e: 'updateColor', value: string): void;
}>()

function changeColor (c: { hex8: string }) {
  emit('updateColor', c.hex8)
}

const isOpenPicker = ref(false)
const left = ref(0)
const top = ref(0)
const el = ref<HTMLElement | null>(null)
function closePicker (e: MouseEvent, force = false) {
  if (!force && el.value?.parentElement?.contains(e.target as HTMLElement)) { return }
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
  <div class="flex w-full">
    <v-input-base
      v-bind="$attrs"
      :value="value"
      :invalid="invalid"
      class="bg-transparent border-default border-2 rounded-4 pl-4 text-sm w-full"
      @input="changeColorByInputEvent"
    />
    <div class="flex cursor-pointer relative">
      <svg
        ref="el"
        class="my-auto mx-4 rounded-4"
        style="
          border: 1px solid var(--border-grey);
          width: 16px;
          height: 16px;
          user-select: none;
        "
        viewBox="0 0 24 24"
        @click="openPicker"
      >
        <path
          fill="currentColor"
          d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"
        />
      </svg>

      <div
        v-if="isOpenPicker"
        class="fixed z-10"
        :style="{
          left: `${left}px`,
          top: `${top}px`,
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
