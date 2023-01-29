import { FC } from "react";

import { PanelBody } from "@/components/asset_details_panel/AssetDetailsPanel";
import { Panel } from "@/components/core/Panel";
import { useSelector } from "@/store/useSelector";

import { Effects } from "./Effects";

export const StripPanel: FC = () => {
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((s) => selectedStripIds.includes(s.id));
  const fps = useSelector((state) => state.scene.fps);

  const strip = selectedStrips[0];
  if (!strip) {
    return <Panel width={100} height={100}></Panel>;
  }

  return (
    <Panel width={100} height={100} style={{ overflow: "auto" }}>
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


