import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";

import { makeNewKeyframes } from "@/components/preview_panel/utils/makeNewKeyframes";
import { Ease, KeyFrame, Strip } from "@/packages/types";
import { Effect } from "@/packages/types/src";
import { actions } from "@/store/scene";
import { useCurrentTime, useFps, useSelectedStrip } from "@/store/useSelector";
import { UndoManager } from "@/UndoManager";

export function useUpdateEffect<T extends Effect>(effect: T, strip: Strip) {
  const currentTime = useCurrentTime();
  const fps = useFps();
  const dispatch = useDispatch();
  const selectedStrips = useSelectedStrip();
  const allEffects = selectedStrips.flatMap((s) =>
    s.effects.filter((e) => e.type === effect.type)
  );
  const effectIdToStripMap = new Map(
    selectedStrips.flatMap((s) =>
      s.effects.filter((e) => e.type === effect.type).map((e) => [e.id, s])
    )
  );

  const emit = (partial: Partial<T>) => {
    const newKFs = makeNewKeyframes<T>(
      partial,
      effect,
      currentTime,
      strip,
      fps
    );
    const redo = () => {
      allEffects.forEach((e) => {
        const strip = effectIdToStripMap.get(e.id);
        if (!strip) return;
        dispatch(
          actions.updateEffect({
            effect: {
              ...e,
              ...partial,
              keyframes: newKFs
                ? newKFs
                : partial.keyframes
                ? partial.keyframes
                : e.keyframes,
            } as T,
            stripId: strip.id,
          })
        );
      });
    };

    const undo = () => {
      dispatch(
        actions.updateEffect({
          effect: effect,
          stripId: strip.id,
        })
      );
    };
    UndoManager.main.add({ undo, redo }).run();
  };
  const time = currentTime - strip.start;
  const addKeyFrame = (key: keyof T) => {
    if (typeof key !== "string") return;
    const value = effect[key];
    if (typeof value !== "number") return;
    const newKeyFrames: KeyFrame[] = [
      ...effect.keyframes.filter(
        (k) => Math.abs(k.time - time) > 1 / fps || k.property !== key
      ),
      {
        property: key,
        time,
        ease: Ease.Linear,
        value,
        id: uuid(),
      },
    ];
    const newEffectPartial = {
      keyframes: newKeyFrames,
    } as Partial<T>;
    emit(newEffectPartial);
  };

  return {
    emit,
    addKeyFrame,
  };
}
