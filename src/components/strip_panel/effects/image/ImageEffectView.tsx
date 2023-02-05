import { FC } from "react";

import { VNumberInput } from "@/components/core/NumberEditInput";
import { VSelect } from "@/components/core/VSelect";
import { PropertyName } from "@/components/PropertyName";
import { Row } from "@/components/Row";
import { KeyframeButton } from "@/components/strip_panel/KeyframeButton";
import { useAnimationedValue } from "@/hooks/useAnimationedValue";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import { useStripTime } from "@/hooks/useStripTime";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { ImageEffect, Strip } from "@/packages/vega-types";
import { UndoManager } from "@/UndoManager";
import { exactKeyFrame } from "@/utils/exactKeyFrame";
import { hasKeyFrame } from "@/utils/hasKeyFrame";

import { imageEffectOptions } from "./imageEffectOptions";

export const ImageEffectView: FC<{
  imageEffect: ImageEffect;
  strip: Strip;
}> = (props) => {
  const { imageEffect } = props;
  const { emit, addKeyFrame } = useUpdateEffect<ImageEffect>(
    imageEffect,
    props.strip
  );
  const animation = useAnimationedValue<ImageEffect>(imageEffect, props.strip);
  const imageAssetItems = useAssetOptions("image");
  const time = useStripTime(props.strip);

  return (
    <>
      {imageEffectOptions.numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            <KeyframeButton
              onClick={() => addKeyFrame(key)}
              highlight={!!exactKeyFrame(imageEffect, key, time)}
              active={hasKeyFrame(imageEffect, key)}
            ></KeyframeButton>
            <VNumberInput
              value={animation(key)}
              scale={imageEffectOptions.scaleKeysMap[key]}
              max={imageEffectOptions.minMaxKeysMap[key]?.[1]}
              min={imageEffectOptions.minMaxKeysMap[key]?.[0]}
              view={imageEffectOptions.viewKeysMap[key]}
              onInput={(value) => emit({ [key]: value })}
              onChange={(value) =>
                UndoManager.main
                  .add({
                    undo: () => {
                      emit({ [key]: imageEffect[key] });
                    },
                    redo: () => emit({ [key]: value }),
                  })
                  .run()
              }
            />
          </Row>
        );
      })}

      <Row>
        <PropertyName>image</PropertyName>
        <VSelect
          items={imageAssetItems}
          onChange={(value) => emit({ imageAssetId: value })}
          value={imageEffect.imageAssetId}
        />
      </Row>
    </>
  );
};
