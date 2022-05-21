<script setup lang="ts">
import { Strip } from "~~/src/core/Strip";
import { VideoStripEffect } from "~~/src/core/VideoStripEffect";
import { VideoStripEffectObject } from "~~/src/core/VideoStripEffectObject";

const props = defineProps<{ strip: Strip }>();
const { timeline } = useTimeline();

const videoEls = ref<HTMLVideoElement[]>([]);

const videoArray = ref<number[]>([]);

const videoEffect = props.strip.effects.find(
  (e) => e.type === "Video"
) as VideoStripEffect;

const videoSrc = "./BigBuckBunny.mp4";

const el = ref<HTMLElement | null>(null);

const pixScale = computed(() => {
  const width =
    el.value?.parentElement?.parentElement?.getBoundingClientRect().width || 1;
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length;
  return width / timeline.value.scale / viewScale;
});

const videoHeight = 50 - 2;

const effectObj = computed(() => {
  const effectObj = effectObjectMap.get(
    videoEffect.id
  ) as VideoStripEffectObject | null;
  return effectObj;
});

function updateVideoArray() {
  if (!el.value) return;
  const parentRect = el.value.getBoundingClientRect();
  if (!effectObj.value) return;
  if (effectObj.value.video.videoHeight == 0) return;
  const ratio =
    effectObj.value.video.videoHeight / effectObj.value.video.videoWidth;

  const videoWidth = videoHeight / ratio;

  const newArray = Array(Math.ceil(parentRect.width / videoWidth) + 1).map(
    (_, i) => i
  );

  if (newArray.length != videoArray.value.length) {
    videoArray.value = newArray;
  }
}

onMounted(() => {
  if (!effectObj.value) return;
  effectObj.value.video.addEventListener("loadedmetadata", () => {
    updateVideoArray();
  });
});

const updateVideoStart = () => {
  if (!el.value) return;
  const parentRect = el.value.getBoundingClientRect();
  videoEls.value.forEach((videoEl) => {
    if (!videoEl) return;
    const rect = videoEl.getBoundingClientRect();
    const startPx = rect.left - parentRect.left;

    videoEl.currentTime = startPx / pixScale.value + videoEffect.start;

    videoEl.addEventListener("loadedmetadata", () => {
      const rect = videoEl.getBoundingClientRect();
      const startPx = rect.left - parentRect.left;
      videoEl.currentTime = startPx / pixScale.value + videoEffect.start;
    });
  });
};

watch(videoEls.value, () => updateVideoStart());
watch(props.strip, () => {
  updateVideoStart();
  updateVideoArray();
});
</script>

<template>
  <div
    v-if="videoEffect"
    ref="el"
    style="height: 100%; display: flex; overflow: hidden; padding: 0 4px"
  >
    <video
      v-for="(_, i) in videoArray"
      :key="i"
      :ref="
        (el) => {
          videoEls[i] = el as HTMLVideoElement;
        }
      "
      :src="videoSrc"
      class="video"
    ></video>
  </div>
</template>

<style scoped>
.video {
  height: 100%;
  max-width: none;
  pointer-events: none;
}
</style>
