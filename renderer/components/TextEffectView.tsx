import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Key } from "tabler-icons-react";
import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/TextEffect";
import { UndoManager } from "../UndoManager";
import { caclulateKeyFrameValue } from "../rendering/updateTextEffect";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { ClickEditInput } from "./core/ClickEditInput";
import { NumberEditInput } from "./core/NumberEditInput";
import { Select } from "./core/Select";
import { IconButton } from "./IconButton";
import { iconProps } from "./iconProps";
import { Row, PropertyName } from "./StripPanel";
import { exactKeyFrame } from "./exactKeyFrame";

export const TextEffectView: FC<{ textEffect: TextEffect; strip: Strip }> = (
  props
) => {
  const { textEffect } = props;
  const dispatch = useDispatch();
  const currentTime = useSelector((state) => state.scene.currentTime);
  const fps = useSelector((state) => state.scene.fps);

  const emit = (partial: Partial<TextEffect>) => {
    dispatch(
      actions.updateEddect({
        effect: { ...textEffect, ...partial },
        stripId: props.strip.id,
      })
    );
  };
  const undo = () => emit({ ...textEffect });

  const assets = useSelector((state) => state.scene.assets);
  const fontAssets = assets.filter((a) => a.type === "font");

  const fontAssetItems = fontAssets.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const numberKeys: (keyof TextEffect)[] = ["x", "y"];
  const scaleKeysMap = {
    x: 1,
    y: 1,
  };
  const viewKeysMap = {
    x: (v) => v.toFixed(0),
    y: (v) => v.toFixed(0),
  };

  const hasKeyFrame = (key: keyof TextEffect) => {
    return textEffect.keyframes.some((k) => k.property === key);
  };

  const time = currentTime - props.strip.start;

  return (
    <>
      <Row>
        <PropertyName>text</PropertyName>
        <ClickEditInput
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
      {numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
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
            <KeyFrameIconButton>
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
            </KeyFrameIconButton>
          </Row>
        );
      })}
      <Row>
        <PropertyName>font size</PropertyName>
        <NumberEditInput
          value={textEffect.fontSize}
          onInput={(value) => emit({ fontSize: value })}
          onChange={(value) =>
            UndoManager.main
              .add({
                undo,
                redo: () => emit({ fontSize: value }),
              })
              .run()
          }
        />
      </Row>
      <Row>
        <PropertyName>font</PropertyName>
        <Select
          items={fontAssetItems}
          onChange={(value) => emit({ fontAssetId: value })}
          value={textEffect.fontAssetId}
        />
      </Row>
    </>
  );
};

const KeyFrameIconButton = styled(IconButton)`
  background: transparent;
  border: 1px solid transparent;
`;
