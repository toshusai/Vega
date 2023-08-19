import { FC } from "react";
import { useDispatch } from "react-redux";
import { css } from "styled-components";

import { Card } from "@/app-ui/src";
import { Effect } from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";

import { AddEffectButton } from "./AddEffectButton";
import { Effects } from "./Effects";

export const StripPanel: FC = () => {
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((s) => selectedStripIds.includes(s.id));
  const fps = useSelector((state) => state.scene.fps);

  const dispatch = useDispatch();

  const handleAddEffect = (effect: Effect) => {
    dispatch(
      actions.updateStrip({
        ...strip,
        effects: [...strip.effects, effect],
      })
    );
  };

  const strip = selectedStrips[0];
  if (!strip) {
    return <Card width={100} height={100}></Card>;
  }

  return (
    <Card
      width={100}
      height={100}
      style={{
        overflow: "auto",
        padding: "0 8px",
      }}
    >
      <div
        css={css`
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        `}
      >
        <div>
          <strong
            style={{
              display: "block",
            }}
          >
            strip
          </strong>
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
        </div>
        <Effects effects={strip.effects} strip={strip} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AddEffectButton onAddEffect={handleAddEffect} />
        </div>
      </div>
    </Card>
  );
};
