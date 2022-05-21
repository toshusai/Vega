<script setup lang="ts">
import { react } from "@babel/types";
import { rejects } from "assert";
import { Strip } from "~~/src/core/Strip";
import { VideoStripEffect } from "~~/src/core/VideoStripEffect";
import { VideoStripEffectObject } from "~~/src/core/VideoStripEffectObject";

const props = defineProps<{ strip: Strip }>();
const { timeline } = useTimeline();

const imageEls = ref<HTMLImageElement[]>([]);

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

const videoWidth = ref(0);

function updateVideoArray() {
  if (!el.value) return;
  const parentRect = el.value.getBoundingClientRect();
  if (!effectObj.value) return;
  if (effectObj.value.video.videoHeight == 0) return;
  const ratio =
    effectObj.value.video.videoHeight / effectObj.value.video.videoWidth;

  videoWidth.value = videoHeight / ratio;

  const newArray = Array(Math.ceil(parentRect.width / videoWidth.value)).map(
    (_, i) => i
  );

  if (newArray.length != videoArray.value.length) {
    videoArray.value = newArray;
  }
}

const videoHeight = 40;
var drawCanvas: HTMLCanvasElement | null = null;
var drawCtx: CanvasRenderingContext2D | null = null;

let thumbnailVideo: HTMLVideoElement | null = null;

var thumbnailCache = new Map<string, string>();

function setCache(time: number, url: string) {
  thumbnailCache.set(time.toFixed(1), url);
}
function getCache(time: number) {
  return thumbnailCache.get(time.toFixed(1));
}

onMounted(() => {
  drawCanvas = document.createElement("canvas");
  drawCtx = drawCanvas.getContext("2d");
  thumbnailVideo = document.createElement("video");
  thumbnailVideo.src = videoSrc;
  document.body.appendChild(thumbnailVideo);
  if (!effectObj.value) return;
  effectObj.value.video.addEventListener("loadedmetadata", () => {
    updateVideoArray();
  });
});

const rootOffset = ref(0);
const updateVideoStart = async () => {
  if (!el.value) return;
  const parentRect = el.value.getBoundingClientRect();
  const promises: (() => Promise<void>)[] = [];
  let i = 0;
  imageEls.value.forEach((imageEl) => {
    if (!imageEl) return;
    if (!thumbnailVideo) return;
    const rect = imageEl.getBoundingClientRect();
    const startPx = 8 + videoWidth.value * i; //rect.left - parentRect.left;
    if (i == 0) {
      // console.log(rect.left, startPx);
    }

    const t = i;
    promises.push(
      () =>
        new Promise((resolve, reject) => {
          let currentTime = 0;

          if (!thumbnailVideo) return resolve();
          thumbnailVideo.onseeked = () => {
            if (!thumbnailVideo) return resolve();
            if (!imageEl) return resolve();
            if (!drawCanvas) return resolve();
            drawCtx?.drawImage(
              thumbnailVideo,
              0,
              0,
              drawCanvas.width,
              drawCanvas.height
            );
            var url = drawCanvas?.toDataURL("image/jpeg", 0.5);

            if (url) {
              setCache(currentTime, url);
              imageEl.src = url;
            }
            resolve();
          };

          currentTime = startPx / pixScale.value + videoEffect.start;
          let left =
            (props.strip.start - timeline.value.start) * pixScale.value;

          if (left < -50) {
            rootOffset.value = (left + 50) % rect.width;
            const l = Math.floor((left + 50) / rect.width) + 1;
            const delta = (l * videoWidth.value) / pixScale.value;
            currentTime -= delta;
          } else {
            rootOffset.value = 0;
          }

          const cache = getCache(currentTime);
          if (cache) {
            // console.log("HIT", currentTime.toFixed(1));
            imageEl.src = cache;
            resolve();
          } else {
            // console.log("notfound", currentTime.toFixed(1));
            thumbnailVideo.currentTime = currentTime;
          }
        })
    );
    i++;
  });

  for (let i = 0; i < promises.length; i++) {
    const element = promises[i];
    await element();
  }
};

watch(imageEls.value, () => updateVideoStart());
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
      <img
        v-for="(_, i) in videoArray"
        :key="i"
        :ref="
        (el) => {
          imageEls[i] = el as HTMLImageElement;
        }
      "
        :width="videoWidth"
        :height="videoHeight"
        class="video"
      />
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
