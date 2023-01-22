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
import {
  Cut,
  Magnet,
  MagnetOff,
  PlayerPause,
  PlayerPlay,
  Trash,
} from "tabler-icons-react";
import { Strip } from "../interfaces/Strip";
import { Key, KeyboardInput } from "../KeyboardInput";
import { UndoManager } from "../UndoManager";
import { roundToFrame } from "./roundToFrame";
import { canMove } from "./canMove";
import { moveStrip } from "./moveStrip";
import { TimeCursor } from "./TimeCursor";
import { SelectRect } from "./SelectRect";
import { iconProps } from "./iconProps";
import { IconButton } from "./IconButton";
import { ToolTip } from "./ToolTip";
import { ContextMenu, StyledContextMenuButton } from "./ContextMenu";
import { uuid } from "short-uuid";
import { Button } from "./core/DropdownLike";
import { AddStripButton } from "./AddStripButton";

export const Timeline: FC = () => {
  const strips = useSelector((state) => state.scene.strips);
  const { start, end } = useSelector((state) => ({
    start: state.scene.viewStartRate,
    end: state.scene.viewEndRate,
  }));
  // const end = useSelector((state) => state.scene.viewEndRate);
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
  const isSnap = useSelector((state) => state.scene.isSnap);

  const dispatch = useDispatch();

  useEffect(() => {
    setPxPerSec(width / ((end - start) * timelineLength));
  }, [width, start, end, timelineLength]);

  const handleMouseDownTimeView = getDragHander<number, void>(
    ({ diffX, pass }) => {
      const newCurrentTime = pass + diffX / pxPerSec;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    },
    ({ startEvent: e }) => {
      // TODO fix magic number
      // TODO merge with KeyFramePanel
      const newCurrentTime =
        (e.clientX - 8) / pxPerSec + start * timelineLength;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
      return newCurrentTime;
    }
  );

  const handleWheelTimeView = (e: React.WheelEvent<HTMLDivElement>) => {
    const value = e.deltaY * 0.0001;
    if (KeyboardInput.isPressed(Key.Alt)) {
      const newStart = start - value;
      const newEnd = end + value;
      dispatch(
        actions.setViewStartAndEndRate({
          start: newStart,
          end: newEnd,
        })
      );
    } else {
      let newStart = start + value;
      let newEnd = end + value;
      if (start + value < 0) {
        newStart = 0;
        newEnd = end - start;
      }
      if (end + value > 1) {
        newEnd = 1;
        newStart = start - (end - 1);
      }
      dispatch(
        actions.setViewStartAndEndRate({
          start: newStart,
          end: newEnd,
        })
      );
    }
  };

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
            withoutSelectedStrips,
            isSnap
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

        const updatedStrips = ctx.movePass?.updatedStrips ?? [];

        UndoManager.main.add({
          redo: () => {
            dispatch(actions.updateStrip(updatedStrips));
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

  const [contextMenuEvent, setContextMenuEvent] = useState<React.MouseEvent<
    HTMLDivElement,
    MouseEvent
  > | null>();

  const handleCutStrip = () => {
    const selectedStrips = strips.filter((strip) =>
      selectedStripIds.includes(strip.id)
    );
    selectedStrips.forEach((strip) => {
      if (
        currentTime > strip.start &&
        currentTime < strip.start + strip.length
      ) {
        const newStrips = [
          {
            ...strip,
            length: currentTime - strip.start,
          },
          {
            ...strip,
            id: uuid(),
            start: currentTime,
            length: strip.length - (currentTime - strip.start),
            effects: strip.effects.map((effect) => ({
              ...effect,
              id: uuid(),
            })),
          },
        ];
        console.log(newStrips);
        dispatch(actions.updateStrip(newStrips));
      }
    });
  };

  const deleteStrip = () => {
    dispatch(actions.removeStrip(selectedStripIds));
  };

  // for strip rendering fix me
  const _pxPerSec = width / ((end - start) * timelineLength);

  return (
    <Panel width={50} height={100}>
      {/* WIP */}
      {/* <ContextMenu
        e={contextMenuEvent}
        onClose={() => {
          setContextMenuEvent(null);
        }}
        show={contextMenuEvent != null}
      >
        <StyledContextMenuButton>hogehgoe</StyledContextMenuButton>
      </ContextMenu> */}
      <div
        ref={ref}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onWheel={handleWheelTimeView}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenuEvent(e);
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2px",
          }}
        >
          <AddStripButton />
          <IconButton
            onClick={() => {
              dispatch(actions.toggleIsPlaying());
            }}
          >
            {isPlaying ? (
              <PlayerPause {...iconProps} />
            ) : (
              <PlayerPlay {...iconProps} />
            )}
            <ToolTip>Play / Pause (Space)</ToolTip>
          </IconButton>
          <IconButton
            onClick={() => {
              dispatch(actions.toggleIsSnap());
            }}
            style={{
              backgroundColor: isSnap ? "var(--color-primary-bg)" : undefined,
            }}
          >
            <Magnet
              {...iconProps}
              color={isSnap ? "var(--color-primary)" : "white"}
            />
            <ToolTip>Toggle Snap (current:{isSnap ? "ON" : "OFF"})</ToolTip>
          </IconButton>
          <IconButton onClick={handleCutStrip}>
            <Cut {...iconProps} />
            <ToolTip>Cut Strips</ToolTip>
          </IconButton>
          <IconButton onClick={deleteStrip}>
            <Trash {...iconProps} />
            <ToolTip>Delete Strips</ToolTip>
          </IconButton>
        </div>
        <div
          style={{
            position: "relative",
            boxSizing: "border-box",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <MemoTimeView
            offsetSec={start * timelineLength}
            endSec={timelineLength}
            pxPerSec={pxPerSec}
            fps={fps}
            frameMode={true}
            onMouseDown={handleMouseDownTimeView}
          />
          <TimeCursor
            left={(-start * timelineLength + currentTime) * pxPerSec}
            top={0}
          />
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
                pxPerSec={_pxPerSec}
                selected={selectedStripIds.includes(strip.id)}
                invalid={invalidStripIds.includes(strip.id)}
                onStripChange={(strip) => {
                  dispatch(actions.updateStrip(strip));
                }}
                onMouseDown={handleMouseDownStrip(strip, false, false)}
                onMouseDownLeftHandle={handleMouseDownStrip(strip, false, true)}
                onMouseDownRightHandle={handleMouseDownStrip(
                  strip,
                  true,
                  false
                )}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
        <MemoScaleScrollBar
          start={start}
          end={end}
          onScaleChange={(start, end) => {
            dispatch(
              actions.setViewStartAndEndRate({
                start,
                end,
              })
            );
          }}
        />
      </div>
    </Panel>
  );
};
