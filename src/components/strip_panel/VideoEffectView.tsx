import { FC } from "react";
import { useDispatch } from "react-redux";

import { Strip } from "@/packages/types";
import { UndoManager } from "@/UndoManager";

import { VideoEffect } from "../../interfaces/effects/VideoEffect";
import { isVideoAsset } from "../../rendering/updateTextEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { NumberEditInput } from "../core/NumberEditInput";
import { Item, Select } from "../core/Select";
import { PickProperties } from "./ImageEffectView";
import { PropertyName,Row } from "./StripPanel";

export const VideoEffectView: FC<{
  videoEffect: VideoEffect;
  strip: Strip;
}> = (props) => {
  const { videoEffect } = props;
  const dispatch = useDispatch();

  const emit = (partial: Partial<VideoEffect>) => {
    dispatch(
      actions.updateEddect({
        effect: { ...videoEffect, ...partial },
        stripId: props.strip.id,
      })
    );
  };
  const undo = () => emit({ ...videoEffect });

  const assets = useSelector((state) => state.scene.assets);
  const videoAssets = assets.filter(isVideoAsset);

  const videoAssetItems: Item[] = videoAssets.map((a) => ({
    value: a.id,
    label: a.name,
  }));
  type NumberProps = PickProperties<VideoEffect, number | undefined>;
  const numberKeys: (keyof NumberProps)[] = ["x", "y", "width", "height"];
  const scaleKeysMap: NumberProps = {
    x: 1,
    y: 1,
  };
  const viewKeysMap: { [key in keyof NumberProps]: (v: number) => string } = {
    x: (v) => v.toFixed(0),
    y: (v) => v.toFixed(0),
  };

  const noVideoAsset =
    videoAssets.find((a) => a.id === videoEffect.videoAssetId) === undefined;

  if (noVideoAsset) {
    videoAssetItems.unshift({
      value: videoEffect.videoAssetId,
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
              value={videoEffect[key] as number}
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
        <PropertyName>video</PropertyName>
        <Select
          items={videoAssetItems}
          onChange={(value) => emit({ videoAssetId: value })}
          value={videoEffect.videoAssetId}
        />
      </Row>
    </>
  );
};
