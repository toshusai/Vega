import { IconTrash } from "@tabler/icons-react";
import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import {
  getDragHander,
  IconButton,
  iconProps,
  ScaleScrollBar,
  SelectRectDiv,
  TimeCursor,
  TimeView,
  ToolTip,
  useSelectRect,
  useWidth,
} from "@/app-ui/src";
import { Key, KeyboardInput } from "@/app-ui/src/KeyboardInput";
import { Card } from "@/components/Card";
import {
  Effect,
  getEasingFunction,
  hasKeyFrameProperty,
  KeyFrame,
  Strip,
} from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";
import { UndoManager } from "@/UndoManager";
import { restrictStartEnd } from "@/utils/restrictStartEnd";
import { roundToFrame } from "@/utils/roundToFrame";

import { ChangeEaseButton } from "./ChangeEaseButton";
import { MakeSVG } from "./MakeSVG";

export const KeyFramePanel: FC = () => {
  const [pxPerSec, setPxPerSec] = useState(1);
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((strip) =>
    selectedStripIds.includes(strip.id)
  );

  const [width, ref] = useWidth([selectedStripIds]);
  const selectedKeyframeIds = useSelector(
    (state) => state.scene.selectedKeyframeIds
  );

  const fps = useSelector((state) => state.scene.fps);
  const currentTime = useSelector((state) => state.scene.currentTime);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(1);

  const handleMouseDownTimeView = getDragHander<number, void>(
    ({ diffX, pass }) => {
      if (!pass || !strip) return;
      const newCurrentTime = pass + diffX / pxPerSec;
      if (newCurrentTime >= 0 && newCurrentTime <= strip.length + strip.start) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    },
    ({ startEvent: e }) => {
      // TODO fix magic number
      if (!strip) return 0;
      const newCurrentTime =
        (e.clientX - 32) / pxPerSec + start * strip.length + strip.start;
      if (newCurrentTime >= 0 && newCurrentTime <= strip.length + strip.start) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
      return newCurrentTime;
    }
  );

  useEffect(() => {
    if (selectedStrips.length !== 1) {
      return;
    }
    const strip = selectedStrips[0];
    if (width === 0) {
      return;
    }

    setPxPerSec(width / ((end - start) * strip.length));
  }, [width, start, end, selectedStrips]);
  const dispatch = useDispatch();
  const { handleMouseDownForSelect, rect } = useSelectRect(() => {
    dispatch(actions.setSelectKeyframeIds([]));
  });
  const strip = selectedStrips[0] as Strip | undefined;

  const allKeyframes = useMemo<KeyFrame[]>(
    () =>
      (
        strip?.effects.flatMap((effect) => {
          if ("keyframes" in effect) {
            return effect.keyframes;
          }
          return [];
        }) as KeyFrame[]
      ).sort((a, b) => a.property.localeCompare(b.property)) ??
      ([] as KeyFrame[]),
    [strip?.effects]
  );

  const uniqueProperties = useMemo(
    () => new Set(allKeyframes.map((keyframe) => keyframe.property)),
    [allKeyframes]
  );

  useEffect(() => {
    if (rect) {
      const selectedKeyframes = allKeyframes.filter((keyframe) => {
        if (!strip) return false;
        const left = (keyframe.time - start * strip.length) * pxPerSec;
        const propertiesIndex = Array.from(uniqueProperties).indexOf(
          keyframe.property
        );
        const right = left + 16;
        const top = 16 * propertiesIndex;
        const bottom = top + 12;
        return (
          left < rect.left + rect.width &&
          right > rect.left &&
          top < rect.top + rect.height &&
          bottom > rect.top
        );
      });
      dispatch(
        actions.setSelectKeyframeIds(selectedKeyframes.map((strip) => strip.id))
      );
    }
  }, [
    allKeyframes,
    dispatch,
    pxPerSec,
    rect,
    start,
    strip,
    strip?.length,
    uniqueProperties,
  ]);

  const recordingState = useSelector((state) => state.scene.recordingState);
  if (recordingState === "recording") {
    return null;
  }
  if (selectedStrips.length !== 1) {
    return <Card />;
  }
  const handleMouseDownKeyFrame = (keyframe: KeyFrame) =>
    getDragHander<
      {
        firstKeyframes: KeyFrame[];
        updatedKeyframeIds: string[];
        firstStrips: Strip[];
      } | null,
      {
        updatedStrips: Strip[];
      } | null
    >(
      (ctx) => {
        const { diffX, pass } = ctx;
        if (!pass || !strip) return null;
        const newSelectedKFIds = pass.updatedKeyframeIds;
        const selectedKFs = allKeyframes
          .filter((strip) => newSelectedKFIds.includes(strip.id))
          .sort((a, b) => a.time - b.time);

        const newKFs = selectedKFs.map((keyframe) => {
          const newTime = roundToFrame(keyframe.time + diffX / pxPerSec, fps);
          return {
            ...keyframe,
            time: newTime,
          };
        });

        const newEffects: Effect[] = [];
        strip.effects.forEach((effect) => {
          if (!hasKeyFrameProperty(effect)) {
            return;
          }
          const newEffect: Effect & { keyframes: KeyFrame[] } = {
            ...effect,
            keyframes: effect.keyframes.map((kf) => {
              const newK = newKFs.find((m) => m.id === kf.id);
              if (newK) {
                return newK;
              }
              return kf;
            }),
          };
          newEffects.push(newEffect);
          dispatch(
            actions.updateEffect({
              stripId: strip.id,
              effect: newEffect,
            })
          );
        });
        return {
          updatedStrips: [
            {
              ...strip,
              effects: newEffects,
            },
          ],
        };
      },
      () => {
        let pass = [keyframe.id];
        if (selectedKeyframeIds.includes(keyframe.id)) {
          pass = [...selectedKeyframeIds];
        } else {
          if (KeyboardInput.isPressed(Key.Shift)) {
            pass = [...selectedKeyframeIds, keyframe.id];
          } else {
            pass = [keyframe.id];
          }
        }
        dispatch(actions.setSelectKeyframeIds(pass));
        return {
          firstKeyframes: [...allKeyframes],
          updatedKeyframeIds: pass,
          firstStrips: [...strips],
        };
      },
      (ctx) => {
        if (ctx.diffX === 0 && ctx.diffY === 0) {
          let newIds: string[] = [];
          if (KeyboardInput.isPressed(Key.Shift)) {
            if (selectedKeyframeIds.includes(keyframe.id)) {
              newIds = selectedKeyframeIds.filter((id) => id !== keyframe.id);
            } else {
              newIds = [...selectedKeyframeIds, keyframe.id];
            }
          } else {
            newIds = [keyframe.id];
          }
          dispatch(actions.setSelectKeyframeIds(newIds));
        }

        const updatedStrips = ctx.movePass?.updatedStrips ?? [];

        // TODO: merge keyframes

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

  const handleDeleteKeyframe = () => {
    if (!strip) return;
    const newEffects = strip.effects.map((effect) => {
      if (!hasKeyFrameProperty(effect)) {
        return effect;
      }
      const newKeyframes = effect.keyframes.filter(
        (kf) => !selectedKeyframeIds.includes(kf.id)
      );
      return {
        ...effect,
        keyframes: newKeyframes,
      };
    });
    const newStrip = {
      ...strip,
      effects: newEffects,
    };
    const redo = () => {
      dispatch(actions.updateStrip([newStrip]));
    };
    const undo = () => {
      dispatch(actions.updateStrip([strip]));
    };
    UndoManager.main.add({ redo, undo }).run();
  };

  if (!strip) return <Card />;

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2px",
        }}
      >
        <ChangeEaseButton />
        <ToolTip content="Delete Keyframe">
          <IconButton onClick={handleDeleteKeyframe}>
            <IconTrash {...iconProps} />
          </IconButton>
        </ToolTip>
      </div>

      <div
        style={{
          display: "flex",
          height: "calc(100% - 16px)",
          width: "100%",
        }}
      >
        <div>
          <div style={{ height: "16px", width: "32px" }}></div>
          <div>
            {Array.from(uniqueProperties).map((property, j) => {
              return (
                <div
                  key={`${j}`}
                  style={{
                    height: "16px",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {property}
                </div>
              );
            })}
          </div>
        </div>
        <div
          ref={ref}
          style={{ width: "100%", position: "relative", overflow: "hidden" }}
        >
          <TimeView
            offsetSec={start * strip.length}
            pxPerSec={pxPerSec}
            onMouseDown={handleMouseDownTimeView}
          />
          <TimeCursor
            left={
              (-start * strip.length + (currentTime - strip.start)) * pxPerSec
            }
            top={0}
            bottom={16} // for scroll bar
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              height: "calc(100% - 16px - 20px)",
              overflow: "hidden",
              userSelect: "none",
            }}
            onMouseDown={handleMouseDownForSelect}
          >
            <SelectRectDiv
              $height={rect?.height ?? 0}
              $left={rect?.left ?? 0}
              $top={rect?.top ?? 0}
              $width={rect?.width ?? 0}
            ></SelectRectDiv>
            {allKeyframes.map((keyframe, j) => {
              const x = (keyframe.time - start * strip.length) * pxPerSec;
              const propertiesIndex = Array.from(uniqueProperties).indexOf(
                keyframe.property
              );
              return (
                <div
                  key={`${j}`}
                  onMouseDown={handleMouseDownKeyFrame(keyframe)}
                >
                  <MakeSVG
                    f={getEasingFunction(keyframe.ease)}
                    style={{
                      position: "absolute",
                      left: x,
                      top: 16 * propertiesIndex,
                      border: selectedKeyframeIds.includes(keyframe.id)
                        ? "1px solid var(--color-strip-selected)"
                        : "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <ScaleScrollBar
            start={start}
            end={end}
            minimumRange={1 / strip.length}
            onScaleChange={(start, end) => {
              const result = restrictStartEnd(start, end, strip.length, 1);
              const [_start, _end] = result;
              setStart(_start);
              setEnd(_end);
            }}
          />
        </div>
      </div>
    </Card>
  );
};
