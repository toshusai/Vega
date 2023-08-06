import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "@/hooks/useSelector";
import { stripIsVisible } from "@/rendering/stripIsVisible";
import { actions } from "@/store/scene";

import { PreviewRootID } from "./Preview";
import { effectToRect } from "./utils/textEffectToRect";


export function useHandleSelectStrip() {
  const dispatch = useDispatch();
  const strips = useSelector((state) => state.scene.strips);
  const fps = useSelector((state) => state.scene.fps);
  const currentTime = useSelector((state) => state.scene.currentTime);
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const left = useSelector((state) => state.scene.canvasLeft ?? 0);
  const top = useSelector((state) => state.scene.canvasTop ?? 0);
  const scale = useSelector((state) => state.scene.canvasScale ?? 1);
  const handleSelectStrip = useCallback(
    (e: MouseEvent) => {
      const el = document.getElementById(PreviewRootID);
      if (!el) return;
      const rect = el.getBoundingClientRect();

      const clickXInRootSpace = e.clientX - rect.left;
      const clickYInRootSpace = e.clientY - rect.top;

      let allHitIds: string[] = [];
      strips.forEach((strip) => {
        if (!stripIsVisible(strip, currentTime, fps)) return;
        strip.effects.forEach((effect) => {
          const rect = effectToRect(
            effect,
            scale,
            left,
            top,
            currentTime - strip.start,
            fps
          );
          if (rect &&
            clickXInRootSpace > rect.$left &&
            clickXInRootSpace < rect.$left + rect.$width &&
            clickYInRootSpace > rect.$top &&
            clickYInRootSpace < rect.$top + rect.$height) {
            allHitIds.push(strip.id);
          }
        });
      });

      if (allHitIds.length === 0) {
        return;
      }
      if (selectedStripIds.length > 1) {
        return;
      }
      if (selectedStripIds.length === 0) {
        dispatch(actions.setSelectedStripIds([allHitIds[0]]));
        return;
      }
      const currentIndex = allHitIds.indexOf(selectedStripIds[0]);
      if (currentIndex === -1) {
        dispatch(actions.setSelectedStripIds([allHitIds[0]]));
        return;
      }
      const nextIndex = (currentIndex + 1) % allHitIds.length;
      dispatch(actions.setSelectedStripIds([allHitIds[nextIndex]]));
      return;
    },
    [strips, left, top, currentTime, fps, selectedStripIds, dispatch, scale]
  );
  return handleSelectStrip;
}
