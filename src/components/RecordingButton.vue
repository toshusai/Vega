<script setup lang="ts">
import '~/assets/css/main.css'
import { Recorder } from '../core/Recorder'
import { Strip } from '../core/Strip'
import { download } from '../utils/download'
import RecordingModal from './RecordingModal.vue'

const { timeline, startRecording, play, update: updateTime } = useTimeline()

const isRecording = ref(false)

function cancelRecord () {
  startRecording(false)
  isRecording.value = false
  updateTime(0, true)
  play(false)
}

function startRecord () {
  if (Recorder.main) {
    Recorder.main.start(timeline.value.strips as Strip[])
    updateTime(0, true)
    startRecording()
    play(true)
    isRecording.value = true
    Recorder.main.onEnd = (blob) => {
      startRecording(false)
      download(blob, 'hoge.webm')
      isRecording.value = false
      updateTime(0, true)
      play(false)
    }
  }
}
const isOpen = ref(false)
</script>

<template>
  <button @click="() => (isOpen = true)">
    recording
  </button>
  <recording-modal
    :is-open="isOpen"
    :is-recording="isRecording"
    @close="()=>isOpen=false"
    @start-recording="startRecord"
    @stop-recording="cancelRecord"
  />
</template>

<style scoped></style>
