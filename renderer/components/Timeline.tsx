import { FC, useEffect, useState } from "react";
import { MemoTimeView } from "./TimeView";
import { Panel, PanelInner } from "../components/core/Panel";
import { getDragHander, MemoStripUI } from "./StripUI";
import { MemoScaleScrollBar } from "./ScaleScrollBar";
import { useWidth } from "../hooks/useWidth";
import { useDispatch } from "react-redux";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import {
  ArrowBadgeDown,
  Cut,
  PlayerPause,
  PlayerPlay,
  TriangleInverted,
} from "tabler-icons-react";

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
  const isPlaying = useSelector((state) => state.scene.isPlaying);

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
    <Panel width={50}>
      <div
        ref={ref}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2px",
          }}
        >
          <button
            onClick={() => {
              dispatch(actions.toggleIsPlaying());
            }}
            style={{
              padding: "0",
              width: "16px",
              minHeight: "16px",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              display: "flex",
              borderRadius: "4px",
              backgroundColor: "var(--color-input-background)",
            }}
          >
            {isPlaying ? (
              <PlayerPause
                style={{ margin: "auto" }}
                strokeWidth={2}
                color="white"
                size={12}
              />
            ) : (
              <PlayerPlay
                style={{ margin: "auto" }}
                strokeWidth={2}
                color="white"
                size={12}
              />
            )}
          </button>
        </div>
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
            boxSizing: "border-box",
            height: "100%",
            // border: "1px solid white",
            overflow: "hidden",
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
        // 16px is the height of the scrollbar,
        // 18px is the height of the timeview
        height: "calc(100% - 16px - 18px - 2px)",
        width: "1px",
        top: "18px",
        backgroundColor: "red",
        zIndex: 100,
        left: props.left,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          background: "red",
          left: "0px",
          top: "0px",
          width: "8px",
          height: "8px",
        }}
      />
    </div>
  );
};
