import { FC } from "react";

import { NumberEditInput } from "@/components/core/NumberEditInput";
import { Select } from "@/components/core/Select";
import { PropertyName } from "@/components/PropertyName";
import { Row } from "@/components/Row";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { AudioEffect, Strip } from "@/packages/types";
import { UndoManager } from "@/UndoManager";

import { audioEffectOptions } from "./audioEffectOptions";

export const AudioEffectView: FC<{
  audioEffect: AudioEffect;
  strip: Strip;
}> = (props) => {
  const { audioEffect } = props;
  const { emit } = useUpdateEffect<AudioEffect>(audioEffect, props.strip);
  const audioAssetItems = useAssetOptions("audio", audioEffect.audioAssetId);
  return (
    <>
      {audioEffectOptions.numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
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
