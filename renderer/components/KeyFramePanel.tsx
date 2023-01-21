import { FC, useEffect, useState } from "react";
import { useWidth } from "../hooks/useWidth";
import { useSelector } from "../store/useSelector";
import { Panel } from "./core/Panel";
import { TimeView } from "./TimeView";

export const KeyFramePanel: FC = () => {
  const [width, ref] = useWidth();
  const [pxPerSec, setPxPerSec] = useState(1);
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((strip) =>
    selectedStripIds.includes(strip.id)
  );

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(1);
  useEffect(() => {
    if (selectedStrips.length !== 1) {
      return;
    }
    const strip = selectedStrips[0];
    setPxPerSec(width / ((end - start) * strip.length));
  }, [width, start, end, selectedStrips]);

  if (selectedStrips.length !== 1) {
    return <Panel />;
  }

  return (
    <Panel>
      <div ref={ref}>
        <TimeView
          endSec={10}
          offsetSec={0}
          pxPerSec={pxPerSec}
          fps={60}
          frameMode={true}
        />
      </div>
    </Panel>
  );
};
