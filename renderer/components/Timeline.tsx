import { FC, useEffect, useState } from "react";
import { MemoTimeView } from "./TimeView";
import { Panel } from "../components/core/Panel";
import { MemoStripUI } from "./StripUI";
import { getDragHander } from "./getDragHander";
import { MemoScaleScrollBar } from "./ScaleScrollBar";
import { useWidth } from "../hooks/useWidth";
import { useDispatch } from "react-redux";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { PlayerPause, PlayerPlay } from "tabler-icons-react";
import { Strip } from "../interfaces/Strip";
import { Key, KeyboardInput, UndoManager } from "../KeyboardInput";
import { roundToFrame } from "./roundToFrame";
import { canMove } from "./canMove";
import { moveStrip } from "./moveStrip";
import { TimeCursor } from "./TimeCursor";
import { SelectRect } from "./SelectRect";

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
  const [invalidStripIds, setInvalidStripIds] = useState<string[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setPxPerSec(width / ((end - start) * timelineLength));
  }, [width, start, end, timelineLength]);

  let newt = 0;
  const handleMouseDownTimeView = getDragHander(
    ({ diffX }) => {
      const newCurrentTime = newt + diffX / pxPerSec;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    },
    ({ startEvent: e }) => {
      const newCurrentTime =
        (e.clientX - 4) / pxPerSec + start * timelineLength;
      newt = newCurrentTime;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    }
  );

  const handleMouseDownStrip = (
    strip: Strip,
    keepStart: boolean,
    keepEnd: boolean
  ) =>
    getDragHander<
      {
        updatedStripIds: string[];
        firstStrips: Strip[];
      },
      {
        updatedStrips: Strip[];
        invalidIds: string[];
      } | null
    >(
      ({ diffX, diffY, pass }) => {
        const newSelectedStripIds = pass.updatedStripIds;
        const selectedStrips = strips
          .filter((strip) => newSelectedStripIds.includes(strip.id))
          .sort((a, b) => a.start - b.start);

        const withoutSelectedStrips = strips.filter(
          (strip) => newSelectedStripIds.includes(strip.id) === false
        );

        const newStrips = selectedStrips.map((strip) => {
          return moveStrip(
            strip,
            diffX,
            diffY,
            pxPerSec,
            fps,
            keepEnd,
            keepStart,
            timelineLength,
            withoutSelectedStrips
          );
        });

        const invalidIds = newStrips
          .map((strip) =>
            canMove(strip, withoutSelectedStrips, timelineLength)
              ? ""
              : strip.id
          )
          .filter((id) => id !== "");
        setInvalidStripIds(invalidIds);
        dispatch(actions.updateStrip(newStrips));
        return {
          updatedStrips: newStrips,
          invalidIds,
        };
      },
      () => {
        let pass = [strip.id];
        if (selectedStripIds.includes(strip.id)) {
          pass = [...selectedStripIds];
        } else {
          if (KeyboardInput.isPressed(Key.Shift)) {
            pass = [...selectedStripIds, strip.id];
          } else {
            pass = [strip.id];
          }
        }
        dispatch(actions.setSelectedStripIds(pass));
        return {
          firstStrips: [...strips],
          updatedStripIds: pass,
        };
      },
      (ctx) => {
        if (ctx.diffX === 0 && ctx.diffY === 0) {
          let newIds: string[] = [];
          if (KeyboardInput.isPressed(Key.Shift)) {
            if (selectedStripIds.includes(strip.id)) {
              newIds = selectedStripIds.filter((id) => id !== strip.id);
            } else {
              newIds = [...selectedStripIds, strip.id];
            }
          } else {
            newIds = [strip.id];
          }
          dispatch(actions.setSelectedStripIds(newIds));
        }

        if (ctx.movePass && ctx.movePass.invalidIds.length > 0) {
          dispatch(actions.updateStrip(ctx.pass.firstStrips));
          setInvalidStripIds([]);
          return;
        }

        UndoManager.main.add({
          redo: () => {
            dispatch(actions.updateStrip(ctx.movePass.updatedStrips || []));
          },
          undo: () => {
            dispatch(actions.updateStrip(ctx.pass.firstStrips));
          },
        });
      }
    );

  const [rect, setRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const handleMouseDownForSelect = getDragHander(
    ({ diffX, diffY, startEvent }) => {
      const el = startEvent.target as HTMLElement;
      const rect = el.getBoundingClientRect();
      let left = startEvent.clientX - rect.left;
      let top = startEvent.clientY - rect.top;
      let width = diffX;
      let height = diffY;
      if (width < 0) {
        left += width;
        width = -width;
      }
      if (height < 0) {
        top += height;
        height = -height;
      }
      setRect({ left, top, width, height });
    },
    undefined,
    (ctx) => {
      setRect(null);
      if (ctx.diffX === 0 && ctx.diffY === 0) {
        dispatch(actions.setSelectedStripIds([]));
      }
    }
  );

  useEffect(() => {
    if (rect) {
      const selectedStrips = strips.filter((strip) => {
        const left = (strip.start - start * timelineLength) * pxPerSec;
        const right = left + strip.length * pxPerSec;
        const top = strip.layer * 44 + 4;
        const bottom = top + 40;
        return (
          left < rect.left + rect.width &&
          right > rect.left &&
          top < rect.top + rect.height &&
          bottom > rect.top
        );
      });
      dispatch(
        actions.setSelectedStripIds(selectedStrips.map((strip) => strip.id))
      );
    }
  }, [rect]);

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
            overflow: "hidden",
          }}
          onMouseDown={handleMouseDownForSelect}
        >
          <SelectRect
            $height={rect?.height ?? 0}
            $left={rect?.left ?? 0}
            $top={rect?.top ?? 0}
            $width={rect?.width ?? 0}
          ></SelectRect>
          {strips.map((strip) => (
            <MemoStripUI
              {...strip}
              key={strip.id}
              fps={fps}
              offset={start * timelineLength}
              pxPerSec={pxPerSec}
              selected={selectedStripIds.includes(strip.id)}
              invalid={invalidStripIds.includes(strip.id)}
              onStripChange={(strip) => {
                dispatch(actions.updateStrip(strip));
              }}
              onMouseDown={handleMouseDownStrip(strip, false, false)}
              onMouseDownLeftHandle={handleMouseDownStrip(strip, false, true)}
              onMouseDownRightHandle={handleMouseDownStrip(strip, true, false)}
              onClick={() => {}}
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
