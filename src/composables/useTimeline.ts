import { Ref } from "nuxt/dist/app/compat/capi";
import {
  EffectObject,
  StripEffect,
  TextStripEffect,
  TextStripEffectObject,
  Timeline,
} from "../core/Timeline";

const initialTimelineState: Timeline = {
  isPlay: false,
  width: 1920,
  height: 1080,
  length: 20,
  curent: 1,
  end: 15,
  scale: 20,
  start: 0,
  layers: [
    {
      strips: [
        {
          id: "strip1",
          start: 2,
          length: 6,
          effects: [
            {
              id: "effect1",
              type: "Text",
              text: "Hello",
              position: {
                x: 0,
                y: 0,
                z: 0,
              },
              color: "#ff0000",
              size: 100,
            },
          ],
        },
      ],
    },
  ],
};

function findStripById(id: string, timeline: Timeline) {
  for (const layer of timeline.layers) {
    for (const strip of layer.strips) {
      if (strip.id === id) {
        return strip;
      }
    }
  }
  return null;
}

function moveStrip(timeline: Ref<Timeline>) {
  return (id: string, start: number, length: number) => {
    const strip = findStripById(id, timeline.value);
    if (!strip) return;
    strip.start = start;
    strip.length = length;
  };
}

function changeView(timeline: Ref<Timeline>) {
  return (start: number, end: number) => {
    timeline.value.start = start;
    timeline.value.end = end;
  };
}

function update(timeline: Ref<Timeline>) {
  return (time: number) => {
    timeline.value.curent = time;

    for (let i = 0; i < timeline.value.layers.length; i++) {
      const layer = timeline.value.layers[i];
      for (let j = 0; j < layer.strips.length; j++) {
        const strip = layer.strips[j];
        let visible = false;
        if (
          timeline.value.curent > strip.start &&
          timeline.value.curent < strip.start + strip.length
        ) {
          visible = true;
        }

        for (let k = 0; k < strip.effects.length; k++) {
          const effect = strip.effects[k];
          if (isText(effect)) {
            const textObj = effectObjectMap.get(
              effect.id
            ) as TextStripEffectObject;
            if (textObj) {
              textObj.update(strip, effect, timeline.value.curent);
            }
          }
        }
      }
    }
  };
}

export const effectObjectMap = new Map<string, EffectObject>();

function play(timeline: Ref<Timeline>) {
  return (state: boolean) => {
    timeline.value.isPlay = state;
  };
}

export function isText(effect: StripEffect): effect is TextStripEffect {
  return effect.type === "Text";
}

import * as THREE from "three";

export const view: State = {
  scene: new THREE.Scene(),
  camera: new THREE.OrthographicCamera(0, 0, 200, 200),
};

export interface State {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  // renderer?: THREE.WebGLRenderer | null;
}

export function useTimeline() {
  const timeline = useState("timeline", () => initialTimelineState);

  onMounted(() => {
    for (const layer of timeline.value.layers) {
      for (const strip of layer.strips) {
        for (const effect of strip.effects) {
          if (isText(effect)) {
            if (!effectObjectMap.has(effect.id)) {
              const textObj = new TextStripEffectObject(effect);
              effectObjectMap.set(effect.id, textObj);
              view.scene.add(textObj.obj);
            }
          }
        }
      }
    }
  });

  return {
    timeline: readonly(timeline),
    moveStrip: moveStrip(timeline),
    changeView: changeView(timeline),
    update: update(timeline),
    play: play(timeline),
  };
}
