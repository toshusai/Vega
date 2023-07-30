import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";
import {
  Cut,
  Magnet,
  PlayerPause,
  PlayerPlay,
  Trash,
} from "tabler-icons-react";

import { isAudioEffect, Strip } from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { canMove } from "@/interfaces/strips/canMove";
import { checkOverlap } from "@/interfaces/strips/checkOverlap";
import { moveStrip } from "@/interfaces/strips/moveStrip";
import { Key, KeyboardInput } from "@/KeyboardInput";
import { releaseAudioAsset } from "@/rendering/updateAudioEffect";
import {
  Card,
  getDragHander,
  IconButton,
  iconProps,
  MemoScaleScrollBar,
  SelectRectDiv,
  TimeCursor,
  TimeView,
  ToolTip,
  useSelectRect,
  useWidth,
} from "@/riapp-ui/src";
import { actions } from "@/store/scene";
import { UndoManager } from "@/UndoManager";
import { roundToFrame } from "@/utils/roundToFrame";

import { AddStripButton } from "./AddStripButton";
import { MemoStripUI, STRIP_GAP, STRIP_HEIGHT } from "./StripUI";

export const Timeline: FC = () => {
  const strips = useSelector((state) => state.scene.strips);
  const { start, end } = useSelector((state) => ({
    start: state.scene.viewStartRate,
    end: state.scene.viewEndRate,
  }));
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
  const { handleMouseDownForSelect, rect } = useSelectRect();

  useEffect(() => {
    setPxPerSec(width / ((end - start) * timelineLength));
  }, [width, start, end, timelineLength]);

  const handleMouseDownTimeView = getDragHander<number, void>(
    ({ diffX, pass }) => {
      if (!pass) return;
      const newCurrentTime = pass + diffX / pxPerSec;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    },
    ({ startEvent: e }) => {
      // TODO merge with KeyFramePanel
      const newCurrentTime = e.clientX / pxPerSec + start * timelineLength;
      if (newCurrentTime >= 0 && newCurrentTime <= timelineLength) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
      return newCurrentTime;
    }
  );

  const handleWheelTimeView = useCallback(
    (e: WheelEvent) => {
      let isTouchPad = false;
      if ("wheelDeltaY" in e) {
        isTouchPad = e.wheelDeltaY
          ? e.wheelDeltaY === -3 * e.deltaY
          : e.deltaMode === 0;
      }

      if (KeyboardInput.isPressed(Key.Alt)) {
        const value = e.deltaY * 0.0001;
        e.preventDefault();
        const newStart = start - value;
        const newEnd = end + value;
        dispatch(
          actions.setViewStartAndEndRate({
            start: newStart,
            end: newEnd,
          })
        );
      } else if (KeyboardInput.isPressed(Key.Shift) || isTouchPad) {
        let delta = e.deltaY;
        if (isTouchPad && KeyboardInput.isPressed(Key.Shift)) {
          delta = e.deltaY;
        } else if (isTouchPad) {
          delta = e.deltaX;
        }

        const value = delta * 0.0001;

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
    },
    [dispatch, end, start]
  );
  useEffect(() => {
    const el = ref.current;
    const copy = (e: ClipboardEvent) => {
      e.clipboardData?.setData("text/plain", JSON.stringify(selectedStripIds));
      e.preventDefault();
    };
    const paste = (e: ClipboardEvent) => {
      const data = e.clipboardData?.getData("text/plain");
      if (!data) return;
      const pastedStripIds = JSON.parse(data) as string[];
      if (!Array.isArray(pastedStripIds)) return;
      const pastedStrips = strips.filter((strip) =>
        pastedStripIds.includes(strip.id)
      );

      const createNewStrips = (pastedStrips: Strip[], plusLayer: number) => {
        const newStrips = pastedStrips.map((strip) => {
          return {
            ...strip,
            layer: strip.layer + plusLayer,
            id: uuid(),
            effects: strip.effects.map((effect) => ({
              ...effect,
              id: uuid(),
            })),
            start: currentTime,
          } as Strip;
        });
        return newStrips;
      };

      e.preventDefault();
      for (let i = 0; i < 8; i++) {
        const newStrips = createNewStrips(pastedStrips, i);
        let isOverlap = false;
        for (const strip of newStrips) {
          if (checkOverlap(strips, strip)) {
            isOverlap = true;
            break;
          }
        }
        if (!isOverlap) {
          UndoManager.main
            .add({
              undo: () => {
                dispatch(actions.updateStripsForce(strips));
              },
              redo: () => {
                dispatch(actions.updateStrip(newStrips));
              },
            })
            .run();
          return;
        }
      }
      alert("There is no space to paste");
    };

    ref.current?.addEventListener("copy", copy, {
      passive: false,
    });
    ref.current?.addEventListener("paste", paste);
    ref.current?.addEventListener("wheel", handleWheelTimeView, {
      passive: false,
    });
    return () => {
      el?.removeEventListener("copy", copy);
      el?.removeEventListener("paste", paste);
      el?.removeEventListener("wheel", handleWheelTimeView);
    };
  }, [
    currentTime,
    dispatch,
    handleWheelTimeView,
    ref,
    selectedStripIds,
    strips,
  ]);

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
        if (!pass) return null;
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
        if (ref.current) {
          // select for copy event
          getSelection()?.selectAllChildren(ref.current);
        }
        ctx.startEvent.preventDefault();
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
          if (!ctx.pass) return;
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
            if (!ctx.pass) return;
            dispatch(actions.updateStrip(ctx.pass.firstStrips));
          },
        });
      }
    );

  useEffect(() => {
    if (rect) {
      const selectedStrips = strips.filter((strip) => {
        const left = (strip.start - start * timelineLength) * pxPerSec;
        const right = left + strip.length * pxPerSec;
        const top = strip.layer * (STRIP_HEIGHT + STRIP_GAP);
        const bottom = top + STRIP_HEIGHT;
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
    } else {
      dispatch(actions.setSelectedStripIds([]));
    }
  }, [dispatch, pxPerSec, rect, start, strips, timelineLength]);

  const scrollRef = useRef<HTMLDivElement>(null);

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
            effects: strip.effects.map((effect) => {
              if ("offset" in effect && typeof effect.offset === "number") {
                return {
                  ...effect,
                  id: uuid(),
                  offset: effect.offset + (currentTime - strip.start),
                };
              }
              return {
                ...effect,
                id: uuid(),
              };
            }),
          },
        ];
        dispatch(actions.updateStrip(newStrips));
      }
    });
  };

  const deleteStrip = () => {
    const selectedStrips = strips.filter((strip) =>
      selectedStripIds.includes(strip.id)
    );
    selectedStrips.forEach((strip) => {
      strip.effects.forEach((effect) => {
        if (isAudioEffect(effect)) {
          releaseAudioAsset(effect);
        }
      });
    });
    const clone = [...strips];
    UndoManager.main
      .add({
        redo: () => {
          dispatch(actions.removeStrip(selectedStripIds));
        },
        undo: () => {
          dispatch(actions.updateStrip(clone));
        },
      })
      .run();
  };

  // for strip rendering fix me
  const _pxPerSec = width / ((end - start) * timelineLength);

  const maxLayer = strips.reduce((max, strip) => {
    return Math.max(max, strip.layer);
  }, 0);

  const recordingState = useSelector((state) => state.scene.recordingState);
  if (recordingState === "recording") {
    return null;
  }

  return (
    <Card width={100} height={100}>
      <div
        ref={ref}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onContextMenu={(e) => {
          e.preventDefault();
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
          <TimeView
            offsetSec={start * timelineLength}
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
              height: "calc(100% - 22px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            ref={scrollRef}
            onMouseDown={handleMouseDownForSelect}
          >
            <SelectRectDiv
              $height={rect?.height ?? 0}
              $left={rect?.left ?? 0}
              $top={rect?.top ?? 0}
              $width={rect?.width ?? 0}
            ></SelectRectDiv>
            {[...Array(maxLayer + 1)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  background: "black",
                  left: 0,
                  top: `${(i + 1) * (STRIP_HEIGHT + STRIP_GAP) - STRIP_GAP}px`,
                  borderBottom: "1px solid lightgray",
                  width: "100%",
                }}
              ></div>
            ))}
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
            <div
              style={{
                position: "absolute",
                height: "44px",
                top: `${(maxLayer + 1) * (STRIP_GAP + STRIP_HEIGHT)}px`,
                width: "1px",
              }}
            ></div>
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
    </Card>
  );
};
