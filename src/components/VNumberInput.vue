<script setup lang="ts">
defineProps({
  invalid: {
    default: false,
    type: Boolean
  }
})
const emits = defineEmits<{
  (e: 'input', num: number): void
}>()

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  const num = Number.parseFloat(el.value)
  if (Number.isNaN(num)) { return }
  emits('input', num)
}
</script>
<template>
  <v-input-base v-bind="$attrs" @input="onInput" />
</template>
