import { FC } from "react";
import { css } from "styled-components";

import { useSelector } from "@/hooks/useSelector";
import { Card } from "@/riapp-ui/src";

import { AddEffectButton, Effects } from "./Effects";

export const StripPanel: FC = () => {
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((s) => selectedStripIds.includes(s.id));
  const fps = useSelector((state) => state.scene.fps);

  const strip = selectedStrips[0];
  if (!strip) {
    return <Card width={100} height={100}></Card>;
  }

  return (
    <Card width={100} height={100}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AddEffectButton />
      </div>
      <div
        css={css`
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          height: calc(100% - 16px);
        `}
      >
        <strong
          style={{
            marginBottom: "4px",
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
        <Effects effects={strip.effects} strip={strip} />
      </div>
    </Card>
  );
};
