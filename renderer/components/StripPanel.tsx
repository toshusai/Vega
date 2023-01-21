import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Effect } from "../interfaces/Effect";
import { Strip } from "../interfaces/Strip";
import { isTextEffect } from "../interfaces/TextEffect";
import { isVideoEffect, VideoEffect } from "../interfaces/VideoEffect";
import { UndoManager } from "../KeyboardInput";
import { isVideoAsset } from "../rendering/updateTextEffect";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { PanelBody } from "./AssetDetailsPanel";
import { MemoClickEditInput } from "./core/ClickEditInput";
import { NumberEditInput } from "./core/NumberEditInput";
import { Panel } from "./core/Panel";
import { Select } from "./core/Select";
import { TextEffectView } from "./TextEffectView";

export const StripPanel: FC = () => {
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((s) => selectedStripIds.includes(s.id));
  const fps = useSelector((state) => state.scene.fps);

  if (selectedStrips.length !== 1) {
    return <Panel />;
  }

  const strip = selectedStrips[0];

  return (
    <Panel>
      <PanelBody>
        <div style={{ display: "flex" }}>
          <div>start:</div>
          {strip.start.toFixed(3)}, (fame:{" "}
          {(strip.start / (1 / fps)).toFixed(0)})
        </div>
        <div style={{ display: "flex" }}>
          <div>length:</div>
          {strip.length.toFixed(3)}, (fame:{" "}
          {(strip.length / (1 / fps)).toFixed(0)})
        </div>
        <Effects effects={strip.effects} strip={strip} />
      </PanelBody>
    </Panel>
  );
};

const Effects: FC<{ effects: Effect[]; strip: Strip }> = (props) => {
  const { effects } = props;
  return (
    <div>
      {effects.map((effect) => {
        if (isTextEffect(effect)) {
          return (
            <TextEffectView
              key={effect.id}
              textEffect={effect}
              strip={props.strip}
            />
          );
        }
        if (isVideoEffect(effect)) {
          return (
            <VideoEffectView
              key={effect.id}
              videoEffect={effect}
              strip={props.strip}
            />
          );
        }
      })}
    </div>
  );
};

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

  const videoAssetItems = videoAssets.map((a) => ({
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

export const Row = styled.div`
  display: flex;
`;

export const PropertyName = styled.div`
  margin-right: auto;
`;
