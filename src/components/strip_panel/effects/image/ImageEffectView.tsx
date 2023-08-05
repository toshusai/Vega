import { FC, useState } from "react";
import { css } from "styled-components";
import { Link, LinkOff, Resize } from "tabler-icons-react";

import { PropertyName } from "@/components/PropertyName";
import { Row } from "@/components/Row";
import { KeyframeButton } from "@/components/strip_panel/KeyframeButton";
import { ImageEffect, Strip } from "@/core/types";
import { useAnimationedValue } from "@/hooks/useAnimationedValue";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import { useStripTime } from "@/hooks/useStripTime";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { getImageElement } from "@/rendering/updateImageEffect";
import {
  iconProps,
  TransparentIconButton,
  VNumberInput,
  VSelect,
} from "@/riapp-ui/src";
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

  const [lockAspectRatio, setLockAspectRatio] = useState(false);

  const handleChangeWidthOrHeight = (
    key: "width" | "height",
    value: number
  ) => {
    if (lockAspectRatio) {
      const height = imageEffect.height ?? 0;
      const width = imageEffect.width ?? 0;
      const ratio = height / width;
      if (key === "width") {
        emit({ width: value, height: value * ratio });
      } else {
        emit({ width: value / ratio, height: value });
      }
    } else {
      emit({ [key]: value });
    }
  };

  return (
    <>
      {imageEffectOptions.numberKeys.map((key) => {
        if(key === "width" || key === "height") return null;
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
        <PropertyName>width</PropertyName>
        <div
          css={css`
            position: relative;
            display: flex;
          `}
        >
          <TransparentIconButton
            onClick={() => {
              const el = getImageElement(imageEffect);
              if (!el) return;
              emit({
                width: el.width,
                height: el.height,
              });
            }}
            css={css`
              top: 8px;
            `}
          >
            <Resize {...iconProps} />
          </TransparentIconButton>
          <div
            css={css`
              border-top: 1px solid var(--color-text);
              border-left: 1px solid var(--color-text);
              width: 8px;
              height: 2px;
              position: absolute;
              top: 6px;
              right: 0px;
            `}
          ></div>
          <div
            css={css`
              border-bottom: 1px solid var(--color-text);
              border-left: 1px solid var(--color-text);
              width: 8px;
              height: 2px;
              position: absolute;
              top: 24px;
              right: 0px;
            `}
          ></div>
          <TransparentIconButton
            onClick={() => {
              setLockAspectRatio(!lockAspectRatio);
            }}
            css={css`
              top: 8px;
              position: absolute;
              right: 0px;
            `}
          >
            {lockAspectRatio ? (
              <Link {...iconProps} />
            ) : (
              <LinkOff {...iconProps} />
            )}
          </TransparentIconButton>
        </div>
        <KeyframeButton
          onClick={() => addKeyFrame("width")}
          highlight={!!exactKeyFrame(imageEffect, "width", time)}
          active={hasKeyFrame(imageEffect, "width")}
        ></KeyframeButton>
        <VNumberInput
          value={animation("width")}
          scale={imageEffectOptions.scaleKeysMap["width"]}
          max={imageEffectOptions.minMaxKeysMap["width"]?.[1]}
          min={imageEffectOptions.minMaxKeysMap["width"]?.[0]}
          view={imageEffectOptions.viewKeysMap["width"]}
          onInput={(value) => {
            handleChangeWidthOrHeight("width", value);
          }}
          onChange={(value) =>
            UndoManager.main
              .add({
                undo: () => {
                  handleChangeWidthOrHeight("width", imageEffect["width"] ?? 0);
                },
                redo: () => handleChangeWidthOrHeight("width", value),
              })
              .run()
          }
        />
      </Row>
      <Row>
        <PropertyName>height</PropertyName>
        <KeyframeButton
          onClick={() => addKeyFrame("height")}
          highlight={!!exactKeyFrame(imageEffect, "height", time)}
          active={hasKeyFrame(imageEffect, "height")}
        ></KeyframeButton>
        <VNumberInput
          value={animation("height")}
          scale={imageEffectOptions.scaleKeysMap["height"]}
          max={imageEffectOptions.minMaxKeysMap["height"]?.[1]}
          min={imageEffectOptions.minMaxKeysMap["height"]?.[0]}
          view={imageEffectOptions.viewKeysMap["height"]}
          onInput={(value) => handleChangeWidthOrHeight("height", value)}
          onChange={(value) =>
            UndoManager.main
              .add({
                undo: () => {
                  handleChangeWidthOrHeight(
                    "height",
                    imageEffect["height"] ?? 0
                  );
                },
                redo: () => handleChangeWidthOrHeight("height", value),
              })
              .run()
          }
        />
      </Row>
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
