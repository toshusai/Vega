import { Ref } from "nuxt/dist/app/compat/capi";
import { Timeline } from "../core/Timeline";

const initialTimelineState: Timeline = {
  length: 20,
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
          effects: [],
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

export function useTimeline() {
  const timeline = useState("timeline", () => initialTimelineState);

  return {
    timeline: readonly(timeline),
    moveStrip: moveStrip(timeline),
    changeView: changeView(timeline),
  };
}
