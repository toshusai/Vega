import { FC } from "react";

import { PropertyName } from "@/components/PropertyName";
import { Row } from "@/components/Row";
import { KeyframeButton } from "@/components/strip_panel/KeyframeButton";
import { Strip, TextAlign, TextEffect } from "@/core/types";
import { useAnimationedValue } from "@/hooks/useAnimationedValue";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import { useStripTime } from "@/hooks/useStripTime";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { Item, VInput, VNumberInput, VSelect, VTextarea } from "@/riapp-ui/src";
import { UndoManager } from "@/UndoManager";
import { exactKeyFrame } from "@/utils/exactKeyFrame";
import { hasKeyFrame } from "@/utils/hasKeyFrame";

import { textEffectConfig } from "./textEffectConfig";

const alignItems: Item[] = [
  { label: "left", value: "left" },
  { label: "center", value: "center" },
  { label: "right", value: "right" },
];

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
  const fontAssetItems = useAssetOptions("font");
  return (
    <>
      <Row>
        <PropertyName>text</PropertyName>
        <VTextarea
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
            <VInput
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
            <VNumberInput
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
        <PropertyName>align</PropertyName>
        <VSelect
          items={alignItems}
          onChange={(value) => emit({ align: value as TextAlign })}
          value={textEffect.align ?? "left"}
        />
      </Row>
      <Row>
        <PropertyName>font</PropertyName>
        <VSelect
          items={fontAssetItems}
          onChange={(value) => emit({ fontAssetId: value })}
          value={textEffect.fontAssetId ?? ""}
        />
      </Row>
      <Row>
        <PropertyName>font style</PropertyName>
        <VSelect
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
