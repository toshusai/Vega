import { FC, useEffect, useState } from "react";
import { MemoTimeView } from "./TimeView";
import { Panel, PanelInner } from "../components/core/Panel";
import { getDragHander, MemoStripUI } from "./StripUI";
import { MemoScaleScrollBar } from "./ScaleScrollBar";
import { useWidth } from "../hooks/useWidth";
import { useDispatch } from "react-redux";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";

export function roundToFrame(time: number, fps: number) {
  return Math.round(time * fps) / fps;
}

export const Timeline: FC = () => {
  const strips = useSelector((state) => state.scene.strips);
  const start = useSelector((state) => state.scene.viewStartRate);
  const end = useSelector((state) => state.scene.viewEndRate);
  const timelineLength = useSelector((state) => state.scene.length);
  const fps = useSelector((state) => state.scene.fps);
  const currentTime = useSelector((state) => {
    return state.scene.currentTime;
  });
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);

  const [pxPerSec, setPxPerSec] = useState(1);

  const [width, ref] = useWidth();

  useEffect(() => {
    setPxPerSec(width / ((end - start) * timelineLength));
  }, [width, start, end, timelineLength]);

  const dispatch = useDispatch();

  let newt = 0;
  const handleMouseDownTimeView = getDragHander(
    (diffX) => {
      const newCurrentTime = newt + diffX / pxPerSec;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    },
    (e) => {
      const newCurrentTime =
        (e.clientX - 4) / pxPerSec + start * timelineLength;
      newt = newCurrentTime;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    }
  );

  return (
    <Panel>
      <div ref={ref}>
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
                dispatch(actions.updateStrip(strip));
              }}
              key={strip.id}
              fps={fps}
              offset={start * timelineLength}
              pxPerSec={pxPerSec}
              onClick={() => {
                dispatch(actions.setSelectedStripIds([strip.id]));
              }}
              selected={selectedStripIds.includes(strip.id)}
            />
          ))}
        </div>
        <MemoScaleScrollBar
          start={start}
          end={end}
          onScaleChange={(start, end) => {
            dispatch(actions.setViewStartRate(start));
            dispatch(actions.setViewEndRate(end));
          }}
        />
      </div>
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
