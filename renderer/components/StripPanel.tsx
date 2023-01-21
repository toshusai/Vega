import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Effect } from "../interfaces/Effect";
import { Strip } from "../interfaces/Strip";
import { isTextEffect, TextEffect } from "../interfaces/TextEffect";
import { UndoManager } from "../KeyboardInput";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { PanelBody } from "./AssetDetailsPanel";
import { ClickEditInput, MemoClickEditInput } from "./core/ClickEditInput";
import { Panel } from "./core/Panel";

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
      })}
    </div>
  );
};

const TextEffectView: FC<{ textEffect: TextEffect; strip: Strip }> = (
  props
) => {
  const { textEffect } = props;
  const dispatch = useDispatch();

  return (
    <>
      <Row>
        <PropertyName>text</PropertyName>
        <ClickEditInput
          value={textEffect.text}
          onChange={(value) => {
            const redo = () =>
              dispatch(
                actions.updateEddect({
                  effect: { ...textEffect, text: value },
                  stripId: props.strip.id,
                })
              );

            redo();

            UndoManager.main.add({
              undo: () => {
                dispatch(
                  actions.updateEddect({
                    effect: textEffect,
                    stripId: props.strip.id,
                  })
                );
              },
              redo,
            });
          }}
        />
      </Row>
      {/* <Row>
        <PropertyName>x</PropertyName>
        <ClickEditInput value={textEffect.x} />
      </Row>
      <Row>
        <PropertyName>y</PropertyName>
        <ClickEditInput value={textEffect.y} />
      </Row> */}
    </>
  );
};

const Row = styled.div`
  display: flex;
`;

const PropertyName = styled.div`
  margin-right: auto;
`;
