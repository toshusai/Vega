import { Strip } from "@/shared/src";

import { useSelector } from "./useSelector";

export function useStripTime(strip: Strip) {
  return useSelector((state) => state.scene.currentTime - strip.start);
}
