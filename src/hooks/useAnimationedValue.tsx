import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useFps } from "@/hooks/useFps";
import { Effect, Strip } from "@/shared/src";
import { calculateKeyFrameValue } from "@/rendering/calculateKeyFrameValue";
import { PickProperties } from "@/types/PickProperties";

export function useAnimationedValue<T extends Effect>(effect: T, strip: Strip) {
  type NumberProps = PickProperties<T, number | undefined>;
  const currentTime = useCurrentTime();
  const time = currentTime - strip.start;
  const fps = useFps();
  const animation = (key: keyof NumberProps) => {
    return calculateKeyFrameValue(
      effect.keyframes,
      time,
      key,
      (effect[key] as number) ?? 0,
      fps
    );
  };
  return animation;
}
