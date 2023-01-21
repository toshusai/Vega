import { FC, useEffect, useState } from "react";
import { useWidth } from "../hooks/useWidth";
import { useSelector } from "../store/useSelector";
import { Panel } from "./core/Panel";
import { easeInExpo } from "./easing";
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
  const strip = selectedStrips[0];

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

        <div
          style={{
            display: "flex",
          }}
        >
          {strip.effects.map((effect, i) => {
            if ("keyframes" in effect && Array.isArray(effect.keyframes)) {
              return effect.keyframes.map((keyframe, j) => {
                const x = keyframe.time * pxPerSec;
                return (
                  <div key={`${i}${j}`}>
                    <MmakeSVG f={easeInExpo} />
                  </div>
                );
              });
            }
            return null;
          })}
        </div>
      </div>
    </Panel>
  );
};

const MmakeSVG: FC<{ f: (x: number) => number }> = (props) => {
  const points = [];
  const padding = 4;
  const width = 16;
  const height = 12;
  const step = 100;
  for (let i = 0; i < step; i++) {
    const x = i / step;
    const y = props.f(x);
    points.push(`${padding + x * width} ${padding + (1 - y) * height}`);
  }
  const d = `M ${points.join(" ")}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
      preserveAspectRatio="none"
      strokeWidth={2}
    >
      <path d={d} stroke="black" fill="none" />
      <circle cx={padding} cy={padding + height} r="2" fill="red" />
      <circle cx={padding + width} cy={padding} r="2" fill="red" />
    </svg>
  );
};
