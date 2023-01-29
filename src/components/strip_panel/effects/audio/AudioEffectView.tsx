import { FC } from "react";

import { NumberEditInput } from "@/components/core/NumberEditInput";
import { Select } from "@/components/core/Select";
import { KeyframeButton } from "@/components/KeyframeButton";
import { PropertyName } from "@/components/PropertyName";
import { Row } from "@/components/Row";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import { useStripTime } from "@/hooks/useStripTime";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { AudioEffect, Strip } from "@/packages/types";
import { UndoManager } from "@/UndoManager";
import { exactKeyFrame } from "@/utils/exactKeyFrame";
import { hasKeyFrame } from "@/utils/hasKeyFrame";

import { audioEffectOptions } from "./audioEffectOptions";

export const AudioEffectView: FC<{
  audioEffect: AudioEffect;
  strip: Strip;
}> = (props) => {
  const { audioEffect } = props;
  const time = useStripTime(props.strip);
  const { emit, addKeyFrame } = useUpdateEffect<AudioEffect>(
    audioEffect,
    props.strip
  );
  const audioAssetItems = useAssetOptions("audio");
  return (
    <>
      {audioEffectOptions.numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            {audioEffectOptions.keyframesKeys.includes(key) && (
              <KeyframeButton
                onClick={() => addKeyFrame(key)}
                highlight={!!exactKeyFrame(audioEffect, key, time)}
                active={hasKeyFrame(audioEffect, key)}
              ></KeyframeButton>
            )}

            <NumberEditInput
              value={audioEffect[key] as number}
              scale={audioEffectOptions.scaleKeysMap[key]}
              onInput={(value) => emit({ [key]: value })}
              max={audioEffectOptions.minMaxKeysMap[key]?.[1]}
              min={audioEffectOptions.minMaxKeysMap[key]?.[0]}
              onChange={(value) =>
                UndoManager.main
                  .add({
                    undo: () => emit({ [key]: audioEffect[key] }),
                    redo: () => emit({ [key]: value }),
                  })
                  .run()
              }
            />
          </Row>
        );
      })}

      <Row>
        <PropertyName>audio</PropertyName>
        <Select
          items={audioAssetItems}
          onChange={(value) => emit({ audioAssetId: value })}
          value={audioEffect.audioAssetId}
        />
      </Row>
    </>
  );
};
