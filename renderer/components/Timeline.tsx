import { FC, memo, useEffect, useMemo, useReducer, useState } from "react";
import { MemoTimeView, TimeView } from "./TimeView";
import { Panel, PanelInner } from "../components/core/Panel";
import { getDragHander, MemoStripUI, StripUI } from "./StripUI";
import { MemoScaleScrollBar, ScaleScrollBar } from "./ScaleScrollBar";
import { useWidth } from "../hooks/useWidth";
import { useDispatch, useSelector } from "react-redux";
import { SceneState, setCurrentTime } from "../store/scene";
import { SelectorType } from "../store";

export function roundToFrame(time: number, fps: number) {
  return Math.round(time * fps) / fps;
}

export const Timeline: FC = () => {
  const [strips, setStrips] = useState([
    {
      id: "1",
      start: 0,
      length: 5,
      effects: [],
      layer: 1,
    },
    {
      id: "2",
      start: 1,
      length: 2.5,
      effects: [],
      layer: 0,
    },
  ]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0.5);
  const [timelineLength, setTimelineLength] = useState(10);
  const [pxPerSec, setPxPerSec] = useState(1);

  const [width, ref] = useWidth();
  useEffect(() => {
    setPxPerSec(width / ((end - start) * timelineLength));
  }, [width, start, end, timelineLength]);

  const currentTime = useSelector<SelectorType, number>((state) => {
    return state.scene.currentTime;
  });
  const dispatch = useDispatch();

  let newt = 0;
  const handleMouseDownTimeView = getDragHander(
    (diffX) => {
      const newCurrentTime = newt + diffX / pxPerSec;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    },
    (e) => {
      const newCurrentTime =
        (e.clientX - 4) / pxPerSec + start * timelineLength;
      newt = newCurrentTime;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    }
  );

  const fps = 60;

  return (
    <Panel>
      <PanelInner ref={ref}>
        <MemoTimeView
          offsetSec={start * timelineLength}
          endSec={timelineLength}
          pxPerSec={pxPerSec}
          fps={fps}
          frameMode={true}
          onMouseDown={handleMouseDownTimeView}
        />
        <TimeCursor left={(-start * timelineLength + currentTime) * pxPerSec} />
        <div
          style={{
            position: "relative",
          }}
        >
          {strips.map((strip) => (
            <MemoStripUI
              {...strip}
              onStripChange={(strip) => {
                setStrips((strips) =>
                  strips.map((s) => (s.id === strip.id ? strip : s))
                );
              }}
              key={strip.id}
              fps={fps}
              offset={start * timelineLength}
              pxPerSec={pxPerSec}
            />
          ))}
        </div>
        <MemoScaleScrollBar
          start={start}
          end={end}
          onScaleChange={(start, end) => {
            setStart(start);
            setEnd(end);
          }}
        />
      </PanelInner>
    </Panel>
  );
};

const TimeCursor: FC<{
  left: number;
}> = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "1px",
        top: 0,
        backgroundColor: "white",
        left: props.left,
        pointerEvents: "none",
      }}
    />
  );
};
