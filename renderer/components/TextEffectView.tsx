import { FC } from "react";
import { useDispatch } from "react-redux";
import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/TextEffect";
import { UndoManager } from "../KeyboardInput";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { ClickEditInput } from "./core/ClickEditInput";
import { NumberEditInput } from "./core/NumberEditInput";
import { Select } from "./core/Select";
import { Row, PropertyName } from "./StripPanel";

export const TextEffectView: FC<{ textEffect: TextEffect; strip: Strip }> = (
  props
) => {
  const { textEffect } = props;
  const dispatch = useDispatch();

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
      <Row>
        <PropertyName>x</PropertyName>
        <NumberEditInput
          value={textEffect.x}
          onInput={(value) => emit({ x: value })}
          onChange={(value) =>
            UndoManager.main
              .add({
                undo,
                redo: () => emit({ x: value }),
              })
              .run()
          }
        />
      </Row>
      <Row>
        <PropertyName>y</PropertyName>
        <NumberEditInput
          value={textEffect.y}
          onInput={(value) => emit({ y: value })}
          onChange={(value) =>
            UndoManager.main
              .add({
                undo,
                redo: () => emit({ y: value }),
              })
              .run()
          }
        />
      </Row>
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
