<script setup lang="ts">
const { updateLength, timeline } = useTimeline()
const inputLenght = (v: number) => {
  updateLength(v)
}
</script>

<template>
  <v-modal v-bind="$attrs">
    <v-input-base :value="timeline.length" @input="inputLenght" />
  </v-modal>
</template>

<style scoped></style>
