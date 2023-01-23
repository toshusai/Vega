import { FC } from "react";
import { useDispatch } from "react-redux";
import { Strip } from "../../interfaces/Strip";
import { UndoManager } from "@/UndoManager";
import { isImageAsset } from "../../rendering/updateTextEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { NumberEditInput } from "../core/NumberEditInput";
import { Item, Select } from "../core/Select";
import { Row, PropertyName } from "./StripPanel";
import { ImageEffect } from "../../interfaces/effects/ImageEffect";
import { KeyFrameIconButton } from "./KeyFrameIconButton";
import { Key } from "tabler-icons-react";
import { iconProps } from "../core/iconProps";
import { exactKeyFrame } from "@/utils/exactKeyFrame";
import { makeNewKeyframes } from "../preview_panel/Gizmo";
import { KeyFrame } from "@/interfaces/effects/KeyFrame";
import { Ease } from "@/utils/easing";

export const ImageEffectView: FC<{
  imageEffect: ImageEffect;
  strip: Strip;
}> = (props) => {
  const { imageEffect } = props;
  const dispatch = useDispatch();

  const currentTime = useSelector((state) => state.scene.currentTime);
  const fps = useSelector((state) => state.scene.fps);
  const emit = (partial: Partial<ImageEffect>) => {
    const newKFs = makeNewKeyframes<ImageEffect>(
      partial,
      imageEffect,
      currentTime,
      props.strip,
      fps
    );

    dispatch(
      actions.updateEddect({
        effect: {
          ...imageEffect,
          ...partial,
          keyframes: newKFs
            ? newKFs
            : [...imageEffect.keyframes, ...(partial.keyframes ?? [])],
        } as ImageEffect,
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
  const numberKeys: (keyof ImageEffect)[] = [
    "x",
    "y",
    "width",
    "height",
    "opacity",
  ];
  const scaleKeysMap = {
    x: 1,
    y: 1,
    opacity: 0.01,
  };
  const viewKeysMap = {
    x: (v) => v.toFixed(0),
    y: (v) => v.toFixed(0),
  };
  const minMaxKeysMap = {
    opacity: [0, 1],
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
  const time = currentTime - props.strip.start;

  const addKeyFrame = (key: keyof ImageEffect) => {
    const value = imageEffect[key];
    if (typeof value !== "number") return;
    const newKeyFrames: KeyFrame[] = [
      ...imageEffect.keyframes,
      {
        property: key,
        time,
        ease: Ease.Linear,
        value,
        id: Math.random().toString(),
      },
    ];
    emit({ keyframes: newKeyFrames });
  };

  return (
    <>
      {numberKeys.map((key) => {
        return (
          <Row key={key}>
            <PropertyName>{key}</PropertyName>
            <KeyFrameIconButton>
              <Key
                {...iconProps}
                onClick={() => addKeyFrame(key)}
                color={
                  exactKeyFrame(imageEffect, key, time)
                    ? "var(--color-strip-selected)"
                    : hasKeyFrame(imageEffect, key)
                    ? "var(--color-primary)"
                    : "white"
                }
              />
            </KeyFrameIconButton>
            <NumberEditInput
              value={imageEffect[key] as number}
              scale={scaleKeysMap[key]}
              max={minMaxKeysMap[key]?.[1]}
              min={minMaxKeysMap[key]?.[0]}
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

const hasKeyFrame = (effect: ImageEffect, key: keyof ImageEffect) => {
  if (!effect.keyframes) return false;
  return effect.keyframes.some((k) => k.property === key);
};
