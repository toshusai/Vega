<script setup lang="ts">
import { mdiMenuDown } from '@mdi/js'

defineProps<{name:string}>()
const open = ref(true)
</script>

<template>
  <div>
    <button style="display: flex; width: 100%; stroke: white; padding: 0; margin: 4px; height: 16px;" @click="open = !open">
      <div>
        {{ name }}
      </div>
      <div
        style="margin-left: auto; height: 16px"
        :style="{
          transform: open ? `rotate(180deg)` : ``
        }"
      >
        <v-icons :size="16" :path="mdiMenuDown" />
      </div>
    </button>
    <template v-if="open">
      <slot />
    </template>
  </div>
</template>

<style scoped>

</style>
