import { FC } from "react";
import styled from "styled-components";
import { useSelector } from "../../store/useSelector";
import { PanelBody } from "../asset_details_panel/AssetDetailsPanel";
import { Panel } from "../core/Panel";
import { Effects } from "./Effects";

export const StripPanel: FC = () => {
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((s) => selectedStripIds.includes(s.id));
  const fps = useSelector((state) => state.scene.fps);

  if (selectedStrips.length !== 1) {
    return <Panel width={100} height={50} />;
  }

  const strip = selectedStrips[0];

  return (
    <Panel width={100} height={50}>
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

export const Row = styled.div`
  display: flex;
`;

export const PropertyName = styled.div`
  margin-right: auto;
`;
