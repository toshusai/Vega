import { FC } from "react";

import {
  ClickEditInput,
  ClickEditTextarea,
} from "@/components/core/ClickEditInput";
import { NumberEditInput } from "@/components/core/NumberEditInput";
import { Select } from "@/components/core/Select";
import { KeyframeButton } from "@/components/KeyframeButton";
import { PropertyName } from "@/components/PropertyName";
import { Row } from "@/components/Row";
import { useAnimationedValue } from "@/hooks/useAnimationedValue";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { Strip, TextEffect } from "@/packages/types";
import { useStripTime } from "@/store/useSelector";
import { UndoManager } from "@/UndoManager";
import { exactKeyFrame } from "@/utils/exactKeyFrame";
import { hasKeyFrame } from "@/utils/hasKeyFrame";

import { textEffectConfig } from "./textEffectConfig";

export const TextEffectView: FC<{ textEffect: TextEffect; strip: Strip }> = (
  props
) => {
  const { textEffect } = props;
  const time = useStripTime(props.strip);
  const { emit, addKeyFrame } = useUpdateEffect<TextEffect>(
    textEffect,
    props.strip
  );
  const animation = useAnimationedValue<TextEffect>(textEffect, props.strip);
  const fontAssetItems = useAssetOptions("font", textEffect.fontAssetId);
  return (
    <>
      <Row>
        <PropertyName>text</PropertyName>
        <ClickEditTextarea
          style={{
            maxWidth: "100%",
            width: "100%",
            marginLeft: "8px",
          }}
          value={textEffect.text}
          onInput={(value) => emit({ text: value })}
          onChange={(value) =>
            UndoManager.main
              .add({
                undo: () => emit(textEffect),
                redo: () => emit({ text: value }),
              })
              .run()
          }
        />
      </Row>
      {textEffectConfig.stringKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            <ClickEditInput
              value={textEffect[key] as string}
              onInput={(value) => emit({ [key]: value })}
              onChange={(value) =>
                UndoManager.main
                  .add({
                    undo: () => emit({ [key]: textEffect[key] }),
                    redo: () => emit({ [key]: value }),
                  })
                  .run()
              }
            />
          </Row>
        );
      })}
      {textEffectConfig.numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            <KeyframeButton
              onClick={() => addKeyFrame(key)}
              highlight={!!exactKeyFrame(textEffect, key, time)}
              active={hasKeyFrame(textEffect, key)}
            ></KeyframeButton>
            <NumberEditInput
              value={animation(key)}
              scale={textEffectConfig.scaleKeysMap[key]}
              view={textEffectConfig.viewKeysMap[key]}
              onInput={(value) => emit({ [key]: value })}
              onChange={(value) =>
                UndoManager.main
                  .add({
                    undo: () => emit({ [key]: textEffect[key] }),
                    redo: () => emit({ [key]: value }),
                  })
                  .run()
              }
            />
          </Row>
        );
      })}
      <Row>
        <PropertyName>font</PropertyName>
        <Select
          items={fontAssetItems}
          onChange={(value) => emit({ fontAssetId: value })}
          value={textEffect.fontAssetId ?? ""}
        />
      </Row>
      <Row>
        <PropertyName>font style</PropertyName>
        <Select
          items={["normal", "bold", "italic", "bold italic"].map((v) => ({
            value: v,
            label: v,
          }))}
          onChange={(value) => emit({ fontStyle: value })}
          value={textEffect.fontStyle ?? "normal"}
        />
      </Row>
    </>
  );
};
