<script setup lang="ts">
import { mdiRhombus, mdiRhombusOutline } from '@mdi/js'
import InspectorInputBase from './InspectorInputBase.vue'

defineProps<{ label: string; value: number; keyFrame?: boolean }>()

const emit = defineEmits<{
  (e: 'input', value: number): void
  (e: 'key-frame'): void
}>()

function update (e: number) {
  emit('input', e)
}
</script>
<template>
  <inspector-input-base :label="label">
    <div style="display: flex; width: 100%">
      <v-input
        :view="n => n.toFixed(3)"
        v-bind="$attrs"
        :value="value"
        @input="update"
      />
      <v-icons
        v-if="keyFrame"
        viewBox="0 0 24 24"
        class="icon"
        :path="keyFrame ? mdiRhombus : mdiRhombusOutline"
        :fill="keyFrame ? 'orange' : 'currentColor'"
        @click="emit('key-frame')"
      />
    </div>
  </inspector-input-base>
</template>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
  margin: auto;
  cursor: pointer;
  user-select: none;
}
</style>
