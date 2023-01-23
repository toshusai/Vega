import { FC } from "react";
import { useDispatch } from "react-redux";
import { Key } from "tabler-icons-react";
import { Strip } from "../../interfaces/Strip";
import { TextEffect } from "../../interfaces/effects/TextEffect";
import { UndoManager } from "../../UndoManager";
import { caclulateKeyFrameValue } from "../../rendering/updateTextEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { ClickEditInput, ClickEditTextarea } from "../core/ClickEditInput";
import { NumberEditInput } from "../core/NumberEditInput";
import { Item, Select } from "../core/Select";
import { iconProps } from "../core/iconProps";
import { Row, PropertyName } from "./StripPanel";
import { exactKeyFrame } from "../../utils/exactKeyFrame";
import { isTextEffect } from "@/interfaces/effects/utils/isTextEffect";

export const TextEffectView: FC<{ textEffect: TextEffect; strip: Strip }> = (
  props
) => {
  const { textEffect } = props;
  const dispatch = useDispatch();
  const currentTime = useSelector((state) => state.scene.currentTime);
  const fps = useSelector((state) => state.scene.fps);

  const selectedStrips = useSelector((state) =>
    state.scene.strips.filter((s) =>
      state.scene.selectedStripIds.includes(s.id)
    )
  );

  const allTextEffects = selectedStrips.flatMap((s) =>
    s.effects.filter(isTextEffect)
  );
  const effectIdToStripMap = new Map(
    selectedStrips.flatMap((s) =>
      s.effects.filter(isTextEffect).map((e) => [e.id, s])
    )
  );
  const isMulti = selectedStrips.length > 1;

  const emit = (partial: Partial<TextEffect>) => {
    allTextEffects.forEach((e) => {
      const strip = effectIdToStripMap.get(e.id)!;
      dispatch(
        actions.updateEddect({
          effect: { ...e, ...partial },
          stripId: strip.id,
        })
      );
    });
  };
  const undo = () => emit({ ...textEffect });

  const assets = useSelector((state) => state.scene.assets);
  const fontAssets = assets.filter((a) => a.type === "font");

  const fontAssetItems: Item[] = fontAssets.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const numberKeys: (keyof TextEffect)[] = [
    "x",
    "y",
    "fontSize",
    "shadowBlur",
    "outlineWidth",
  ];

  const stringKeys: (keyof TextEffect)[] = [
    "color",
    "outlineColor",
    "shadowColor",
  ];

  const scaleKeysMap = {
    x: 1,
    y: 1,
  };
  const viewKeysMap = {
    x: (v) => v.toFixed(0),
    y: (v) => v.toFixed(0),
  };

  const time = currentTime - props.strip.start;

  const noFontAsset =
    fontAssets.find((a) => a.id === textEffect.fontAssetId) === undefined;

  if (noFontAsset) {
    fontAssetItems.unshift({
      value: textEffect.fontAssetId ?? "",
      label: "No font asset",
      disabled: true,
    });
  }

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
                undo,
                redo: () => emit({ text: value }),
              })
              .run()
          }
        />
      </Row>
      {stringKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            <ClickEditInput
              value={textEffect[key] as string}
              onInput={(value) => emit({ [key]: value })}
              onChange={(value) =>
                UndoManager.main
                  .add({
                    undo,
                    redo: () => emit({ [key]: value }),
                  })
                  .run()
              }
            />
          </Row>
        );
      })}
      {numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            {/* <KeyFrameIconButton>
              <Key
                {...iconProps}
                color={
                  exactKeyFrame(textEffect, key, time)
                    ? "var(--color-strip-selected)"
                    : hasKeyFrame(key)
                    ? "var(--color-primary)"
                    : "white"
                }
              />
            </KeyFrameIconButton> */}

            <NumberEditInput
              value={caclulateKeyFrameValue(
                textEffect.keyframes,
                currentTime - props.strip.start,
                key,
                textEffect[key] as number,
                fps
              )}
              scale={scaleKeysMap[key]}
              view={viewKeysMap[key]}
              onInput={(value) => emit({ [key]: value })}
              onChange={(value) =>
                UndoManager.main
                  .add({
                    undo,
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
