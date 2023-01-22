import { FC } from "react";
import { useDispatch } from "react-redux";
import { Strip } from "../../interfaces/Strip";
import { VideoEffect } from "../../interfaces/effects/VideoEffect";
import { UndoManager } from "../../UndoManager";
import { isVideoAsset } from "../../rendering/updateTextEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { NumberEditInput } from "../core/NumberEditInput";
import { Item, Select } from "../core/Select";
import { Row, PropertyName } from "./StripPanel";

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
  const numberKeys: (keyof VideoEffect)[] = ["x", "y", "scaleX", "scaleY"];
  const scaleKeysMap = {
    x: 1,
    y: 1,
    scaleX: 0.01,
    scaleY: 0.01,
  };
  const viewKeysMap = {
    x: (v) => v.toFixed(0),
    y: (v) => v.toFixed(0),
    scaleX: (v) => v.toFixed(2),
    scaleY: (v) => v.toFixed(2),
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
