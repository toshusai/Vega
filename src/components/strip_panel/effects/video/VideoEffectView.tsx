import { FC } from "react";

import { PropertyName } from "@/components/PropertyName";
import { Row } from "@/components/Row";
import { KeyframeButton } from "@/components/strip_panel/KeyframeButton";
import { Strip, VideoEffect } from "@/core/types";
import { useAnimationedValue } from "@/hooks/useAnimationedValue";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import { useStripTime } from "@/hooks/useStripTime";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { VNumberInput, VSelect } from "@/riapp-ui/src";
import { UndoManager } from "@/UndoManager";
import { exactKeyFrame } from "@/utils/exactKeyFrame";
import { hasKeyFrame } from "@/utils/hasKeyFrame";

import { videoEffectOptions } from "./videoEffectOptions";

export const VideoEffectView: FC<{
  videoEffect: VideoEffect;
  strip: Strip;
}> = (props) => {
  const { videoEffect } = props;
  const time = useStripTime(props.strip);
  const { emit, addKeyFrame } = useUpdateEffect<VideoEffect>(
    videoEffect,
    props.strip
  );
  const animation = useAnimationedValue<VideoEffect>(videoEffect, props.strip);
  const videoAssetItems = useAssetOptions("video");
  return (
    <>
      {videoEffectOptions.numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            <KeyframeButton
              onClick={() => addKeyFrame(key)}
              highlight={!!exactKeyFrame(videoEffect, key, time)}
              active={hasKeyFrame(videoEffect, key)}
            ></KeyframeButton>
            <VNumberInput
              value={animation(key)}
              scale={videoEffectOptions.scaleKeysMap[key]}
              view={videoEffectOptions.viewKeysMap[key]}
              onInput={(value) => emit({ [key]: value })}
              onChange={(value) =>
                UndoManager.main
                  .add({
                    undo: () => emit({ [key]: videoEffect[key] }),
                    redo: () => emit({ [key]: value }),
                  })
                  .run()
              }
            />
          </Row>
        );
      })}

      <Row>
        <PropertyName>video</PropertyName>
        <VSelect
          items={videoAssetItems}
          onChange={(value) => emit({ videoAssetId: value })}
          value={videoEffect.videoAssetId}
        />
      </Row>
    </>
  );
};
