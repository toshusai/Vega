import { FC } from "react";
import { useDispatch } from "react-redux";
import { Strip } from "../../interfaces/Strip";
import { UndoManager } from "../../UndoManager";
import { isImageAsset } from "../../rendering/updateTextEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { NumberEditInput } from "../core/NumberEditInput";
import { Item, Select } from "../core/Select";
import { Row, PropertyName } from "./StripPanel";
import { ImageEffect } from "../../interfaces/effects/ImageEffect";

export const ImageEffectView: FC<{
  imageEffect: ImageEffect;
  strip: Strip;
}> = (props) => {
  const { imageEffect } = props;
  const dispatch = useDispatch();

  const emit = (partial: Partial<ImageEffect>) => {
    dispatch(
      actions.updateEddect({
        effect: { ...imageEffect, ...partial },
        stripId: props.strip.id,
      })
    );
  };
  const undo = () => emit({ ...imageEffect });

  const assets = useSelector((state) => state.scene.assets);
  const imageAssets = assets.filter(isImageAsset);

  const imageAssetItems: Item[] = imageAssets.map((a) => ({
    value: a.id,
    label: a.name,
  }));
  const numberKeys: (keyof ImageEffect)[] = ["x", "y", "width", "height"];
  const scaleKeysMap = {
    x: 1,
    y: 1,
  };
  const viewKeysMap = {
    x: (v) => v.toFixed(0),
    y: (v) => v.toFixed(0),
  };

  const noImageAsset =
    imageAssets.find((a) => a.id === imageEffect.imageAssetId) === undefined;

  if (noImageAsset) {
    imageAssetItems.unshift({
      value: imageEffect.imageAssetId,
      label: "Asset Not Found",
      disabled: true,
    });
  }

  return (
    <>
      {numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            <NumberEditInput
              value={imageEffect[key] as number}
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
        <PropertyName>image</PropertyName>
        <Select
          items={imageAssetItems}
          onChange={(value) => emit({ imageAssetId: value })}
          value={imageEffect.imageAssetId}
        />
      </Row>
    </>
  );
};
