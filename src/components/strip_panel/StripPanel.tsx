import { FC } from "react";

import { useSelector } from "@/hooks/useSelector";
import { Card , PanelBody } from "@/riapp-ui/src";

import { Effects } from "./Effects";

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
    <Card width={100} height={100} style={{ overflow: "auto" }}>
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
    </Card>
  );
};


