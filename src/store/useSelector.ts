import { useSelector as useSelectorRR } from "react-redux";

import { Strip } from "@/packages/types";
import { SelectorType } from "@/store";

export function useSelector<T>(f: (state: SelectorType) => T): T {
  return useSelectorRR<SelectorType, T>(f);
}

export function useCurrentTime() {
  return useSelector((state) => state.scene.currentTime);
}

export function useFps() {
  return useSelector((state) => state.scene.fps);
}

export function useSelectedStrip() {
  return useSelector((state) =>
    state.scene.strips.filter((s) =>
      state.scene.selectedStripIds.includes(s.id)
    )
  );
}

export function useStripTime(strip: Strip) {
  return useSelector((state) => state.scene.currentTime - strip.start);
}
