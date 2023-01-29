import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";

import { makeNewKeyframes } from "@/components/preview_panel/Gizmo";
import { Ease, KeyFrame, Strip } from "@/packages/types";
import { Effect } from "@/packages/types/src";
import { actions } from "@/store/scene";
import { useCurrentTime, useFps } from "@/store/useSelector";
import { UndoManager } from "@/UndoManager";

export function useUpdateEffect<T extends Effect>(effect: T, strip: Strip) {
  const currentTime = useCurrentTime();
  const fps = useFps();
  const dispatch = useDispatch();
  const emit = (partial: Partial<T>) => {
    const newKFs = makeNewKeyframes<T>(
      partial,
      effect,
      currentTime,
      strip,
      fps
    );
    const redo = () => {
      dispatch(
        actions.updateEddect({
          effect: {
            ...effect,
            ...partial,
            keyframes: newKFs
              ? newKFs
              : partial.keyframes
              ? partial.keyframes
              : effect.keyframes,
          } as T,
          stripId: strip.id,
        })
      );
    };

    const undo = () => {
      dispatch(
        actions.updateEddect({
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
