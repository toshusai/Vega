import { useSelector } from "./useSelector";

export function useCurrentTime() {
  return useSelector((state) => state.scene.currentTime);
}
