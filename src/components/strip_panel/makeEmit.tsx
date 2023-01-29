import { Strip } from "@/packages/types";
import { Effect } from "@/packages/types/src";
import { caclulateKeyFrameValue } from "@/rendering/updateTextEffect";
import { useCurrentTime, useFps } from "@/store/useSelector";

import { PickProperties } from "./ImageEffectView";

export function useAnimationedValue<T extends Effect>(effect: T, strip: Strip) {
  type NumberProps = PickProperties<T, number | undefined>;
  const currentTime = useCurrentTime();
  const time = currentTime - strip.start;
  const fps = useFps();
  const animation = (key: keyof NumberProps) => {
    return caclulateKeyFrameValue(
      effect.keyframes,
      time,
      key,
      (effect[key] as number) ?? 0,
      fps
    );
  };
  return animation;
}
