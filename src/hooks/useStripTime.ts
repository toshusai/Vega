import { Strip } from "@/core/types";

import { useSelector } from "./useSelector";

export function useStripTime(strip: Strip) {
  return useSelector((state) => state.scene.currentTime - strip.start);
}
