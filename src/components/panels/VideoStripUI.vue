<script setup lang="ts">
import { react } from "@babel/types";
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
    console.log(videoArray.value.length);
  }
}

const videoHeight = 40;
var drawCanvas: HTMLCanvasElement | null = null;
var drawCtx: CanvasRenderingContext2D | null = null;

var thumbnailCache = new Map<number, string>();

onMounted(() => {
  drawCanvas = document.createElement("canvas");
  drawCtx = drawCanvas.getContext("2d");
  if (!effectObj.value) return;
  effectObj.value.video.addEventListener("loadedmetadata", () => {
    updateVideoArray();
  });
});

const rootOffset = ref(0);
const updateVideoStart = () => {
  if (!el.value) return;
  const parentRect = el.value.getBoundingClientRect();
  let i = 0;
  videoEls.value.forEach((videoEl) => {
    if (!videoEl) return;
    const rect = videoEl.getBoundingClientRect();
    const startPx = rect.left - parentRect.left;

    videoEl.style.visibility = "hidden";
    videoEl.onseeked = () => {
      drawCtx?.drawImage(videoEl, 0, 0);
      var url = drawCanvas?.toDataURL("image/jpeg", 0.5);
      if (url) thumbnailCache.set(videoEl.currentTime, url);
      videoEl.style.visibility = "visible";
    };
    videoEl.currentTime = startPx / pixScale.value + videoEffect.start;
    let left = (props.strip.start - timeline.value.start) * pixScale.value;
    // if (i == 0) console.log(videoEl.currentTime);
    if (left < -50) {
      rootOffset.value = (left + 50) % rect.width;
      const l = Math.floor((left + 50) / rect.width) + 1;
      // 見えなくなった時、消された差分だけ時間を引くい
      videoEl.currentTime -=
        rootOffset.value / pixScale.value + l * (rect.width / pixScale.value);
    }
    if (i == 0) console.log(videoEl.currentTime);
    const tmp = i;
    videoEl.addEventListener("loadedmetadata", () => {
      const rect = videoEl.getBoundingClientRect();
      const startPx = rect.left - parentRect.left;
      // videoEl.currentTime = startPx / pixScale.value + videoEffect.start;
    });
    i++;
  });
};

watch(videoEls.value, () => updateVideoStart());
watch(props.strip, () => {
  updateVideoArray();
  updateVideoStart();
});
watch(timeline.value, () => {
  updateVideoArray();
  updateVideoStart();
});
</script>

<template>
  <div
    v-if="videoEffect"
    ref="el"
    style="
      height: 100%;
      display: flex;
      overflow: hidden;
      padding: 0 4px;
      position: absolute;
      width: 100%;
    "
  >
    <div :style="`margin-left: ${rootOffset + 4}px`" class="flex">
      <video
        v-for="(_, i) in videoArray"
        :key="i"
        :ref="
        (el) => {
          videoEls[i] = el as HTMLVideoElement;
        }
      "
        :height="videoHeight"
        :src="videoSrc"
        class="video"
      ></video>
    </div>
  </div>
</template>

<style scoped>
.video {
  height: 100%;
  max-width: none;
  pointer-events: none;
}
</style>
