import { FC, memo } from "react";

import { useWidth } from "@/hooks/useWidth";

type TimeViewProps = {
  offsetSec: number;
  endSec: number;
  pxPerSec: number;
  fps: number;
  frameMode: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
};
const secStep = [0.01, 0.05, 0.1, 0.2, 0.5, 1, 5, 10, 30, 60];
const frameStep = [1, 5, 10, 30, 60, 120, 300, 600, 1800, 3600];

const minInterval = 32;

export const TimeView: FC<TimeViewProps> = (props) => {
  const pxPerFrame = props.pxPerSec / props.fps;
  const secStepI = secStep.findIndex((s) => s * props.pxPerSec > minInterval);
  const frameStepI = frameStep.findIndex((s) => s * pxPerFrame > minInterval);

  const stepPx = secStep[secStepI] * props.pxPerSec;
  const frameStepPx = frameStep[frameStepI] * pxPerFrame;

  const pointDiff = props.frameMode
    ? frameStep[frameStepI] / frameStep[frameStepI - 1]
    : secStep[secStepI] / secStep[secStepI - 1];

  const pointStepPx = props.frameMode
    ? frameStepPx / pointDiff
    : stepPx / pointDiff;

  const lengthPx = props.endSec * props.pxPerSec;
  const viewNumber = Math.ceil(lengthPx / stepPx);
  const frameViewNumber = Math.ceil(lengthPx / frameStepPx);

  const xPerFrame = props.frameMode ? pxPerFrame : props.pxPerSec;
  const xViewNumber = props.frameMode ? frameViewNumber : viewNumber;
  const xStepPx = props.frameMode ? frameStepPx : stepPx;

  const [width, ref] = useWidth();

  if (viewNumber > 10000) return <div>Too many</div>;
  if (frameViewNumber > 10000) return <div>Too many</div>;

  if (isNaN(xViewNumber)) return null;
  if (isNaN(pointDiff)) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        height: "20px",
        width: "100%",
        overflow: "hidden",
        fontSize: "12px",
        boxSizing: "border-box",
        borderBottom: "1px solid white",
        userSelect: "none",
        color: "white",
      }}
      onMouseDown={props.onMouseDown}
    >
      {Array.from(Array(Math.ceil(viewNumber * pointDiff)).keys()).map((i) => {
        const left = i * pointStepPx - props.offsetSec * props.pxPerSec;
        if (left < -100 || left > width) return null;
        return <TimePoint key={left} left={left} />;
      })}

      {Array.from(Array(Math.ceil(xViewNumber)).keys()).map((i) => {
        const time = (i * xStepPx) / xPerFrame;
        const left = i * xStepPx - props.offsetSec * props.pxPerSec;
        if (left < -100 || left > width) return null;
        return <TimeText key={left} time={time} left={left} />;
      })}
    </div>
  );
};

const TimePoint: FC<{
  left: number;
}> = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: props.left + "px",
        borderLeft: "1px solid gray",
        height: "4px",
        bottom: "0px",
      }}
    ></div>
  );
};

const TimeText: FC<{
  time: number;
  left?: number;
}> = (props) => {
  let viewTime = props.time.toFixed(2);
  if (viewTime.endsWith(".00")) {
    viewTime = viewTime.slice(0, -3);
  } else if (viewTime.endsWith("0")) {
    viewTime = viewTime.slice(0, -1);
  }

  return (
    <div
      style={{
        position: "absolute",
        left: props.left + "px",
        height: "20px",
        borderLeft: "1px solid lightgray",
      }}
    >
      <div style={{ marginLeft: "2px" }}>{viewTime}</div>
    </div>
  );
};

export const MemoTimeView = memo(TimeView, (prev, next) => {
  return (
    prev.offsetSec === next.offsetSec &&
    prev.endSec === next.endSec &&
    prev.pxPerSec === next.pxPerSec &&
    prev.fps === next.fps &&
    prev.frameMode === next.frameMode
  );
});
