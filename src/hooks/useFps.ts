import { useSelector } from "./useSelector";

export function useFps() {
  return useSelector((state) => state.scene.fps);
}
