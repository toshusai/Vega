<script setup lang="ts">
const { updateLength, timeline } = useTimeline()
const inputLenght = (num: number) => {
  updateLength(num)
}
</script>

<template>
  <v-modal v-bind="$attrs">
    <div style="display: flex; margin: 0 16px">
      <div>length: </div>
      <v-number-input :value="timeline.length" @input="inputLenght" />
    </div>
  </v-modal>
</template>

<style scoped></style>
