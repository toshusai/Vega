import { FC } from "react";
import { useDispatch } from "react-redux";
import { Strip } from "../../interfaces/Strip";
import { AudioEffect } from "../../interfaces/effects/AudioEffect";
import { UndoManager } from "@/UndoManager";
import { isAudioAsset } from "../../rendering/updateTextEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { NumberEditInput } from "../core/NumberEditInput";
import { Item, Select } from "../core/Select";
import { Row, PropertyName } from "./StripPanel";

export const AudioEffectView: FC<{
  audioEffect: AudioEffect;
  strip: Strip;
}> = (props) => {
  const { audioEffect } = props;
  const dispatch = useDispatch();

  const emit = (partial: Partial<AudioEffect>) => {
    dispatch(
      actions.updateEddect({
        effect: { ...audioEffect, ...partial },
        stripId: props.strip.id,
      })
    );
  };
  const undo = () => emit({ ...audioEffect });

  const assets = useSelector((state) => state.scene.assets);
  const audioAssets = assets.filter(isAudioAsset);

  const audioAssetItems: Item[] = audioAssets.map((a) => ({
    value: a.id,
    label: a.name,
  }));
  const numberKeys: (keyof AudioEffect)[] = ["volume", "offset"];
  const scaleKeysMap: {
    [key in keyof AudioEffect]?: number;
  } = {
    volume: 0.01,
    offset: 0.01,
  };
  const minMaxKeysMap: {
    [key in keyof AudioEffect]?: [number, number];
  } = {
    volume: [0, 1],
  };

  const noAudioAsset =
    audioAssets.find((a) => a.id === audioEffect.audioAssetId) === undefined;

  if (noAudioAsset) {
    audioAssetItems.unshift({
      value: audioEffect.audioAssetId,
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
              value={audioEffect[key] as number}
              scale={scaleKeysMap[key]}
              onInput={(value) => emit({ [key]: value })}
              max={minMaxKeysMap[key]?.[1]}
              min={minMaxKeysMap[key]?.[0]}
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
        <PropertyName>audio</PropertyName>
        <Select
          items={audioAssetItems}
          onChange={(value) => emit({ audioAssetId: value })}
          value={audioEffect.audioAssetId}
        />
      </Row>
    </>
  );
};
