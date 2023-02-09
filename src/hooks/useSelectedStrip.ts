import { useSelector } from "./useSelector";

export function useSelectedStrip() {
  return useSelector((state) =>
    state.scene.strips.filter((s) =>
      state.scene.selectedStripIds.includes(s.id)
    )
  );
}
