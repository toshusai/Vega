import { useSelector as useSelectorRR } from "react-redux";

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
