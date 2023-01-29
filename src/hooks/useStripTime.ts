import { Strip } from "@/packages/types";

import { useSelector } from "./useSelector";

export function useStripTime(strip: Strip) {
  return useSelector((state) => state.scene.currentTime - strip.start);
}
