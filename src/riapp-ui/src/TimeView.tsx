import { FC } from "react";

import { useWidth } from "./hooks/useWidth";
import styled from "styled-components";
import { TimeText } from "./TimeText";

type TimeViewProps = {
  offsetSec: number;
  endSec: number;
  pxPerSec: number;
  fps: number;
  frameMode: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
};
const secStep = [0.01, 0.05, 0.1, 0.2, 0.5, 1, 5, 10, 30, 60];
const frameStep = [1, 5, 10, 30, 60, 120, 300, 600, 1800, 3600].map(
  (s) => s / 60
);
const minInterval = 32;

function getStepPixel(
  pxPerSec: number,
  minInterval: number,
  step: number[],
  width: number,
  offsetSec = 0
) {
  const stepI = step.findIndex((s) => s * pxPerSec > minInterval);
  const stepPx = step[stepI] * pxPerSec;
  const viewNumber = Math.ceil(width / stepPx);
  const offset = (offsetSec * pxPerSec) % stepPx;
  return [...Array(viewNumber).keys()].map((i) => {
    return i * stepPx - offset;
  });
}

export const TimeView: FC<TimeViewProps> = (props) => {
  const [width, ref] = useWidth();

  const steps = getStepPixel(
    props.pxPerSec,
    minInterval,
    secStep,
    width,
    props.offsetSec
  );
  const pSteps = getStepPixel(
    props.pxPerSec,
    minInterval / 4,
    secStep,
    width,
    props.offsetSec
  );

  return (
    <TimeViewRootDiv ref={ref} onMouseDown={props.onMouseDown}>
      {pSteps.map((left) => {
        return <TimePointDiv $left={left} key={left} />;
      })}
      {steps.map((left) => {
        return (
          <TimeText
            time={left / props.pxPerSec + props.offsetSec}
            key={left}
            left={left}
          />
        );
      })}
    </TimeViewRootDiv>
  );
};

const TimeViewRootDiv = styled.div`
  position: relative;
  height: 20px;
  width: 100%;
  overflow: hidden;
  font-size: 12px;
  box-sizing: border-box;
  border: 1px solid white;
  user-select: none;
  color: white;
`;

const TimePointDiv = styled.div<{ $left: number }>`
  position: absolute;
  left: ${(props) => props.$left}px;
  border-left: 1px solid gray;
  height: 4px;
  bottom: 0px;
`;
