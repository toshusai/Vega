import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useWidth } from "../hooks/useWidth";
import { Effect } from "../interfaces/effects/Effect";
import { Strip } from "../interfaces/Strip";
import { KeyFrame } from "../interfaces/effects/KeyFrame";
import { isTextEffect } from "../interfaces/effects/utils/isTextEffect";
import { Key, KeyboardInput } from "../KeyboardInput";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { UndoManager } from "../UndoManager";
import { Panel } from "./core/Panel";
import { getEasingFunction } from "./easing";
import { getDragHander } from "./getDragHander";
import { MakeSVG } from "./MakeSVG";
import { roundToFrame } from "./roundToFrame";
import { ScaleScrollBar } from "./ScaleScrollBar";
import { SelectRect } from "./SelectRect";
import { TimeCursor } from "./TimeCursor";
import { TimeView } from "./TimeView";

export const KeyFramePanel: FC = () => {
  const [width, ref] = useWidth();
  const [pxPerSec, setPxPerSec] = useState(1);
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((strip) =>
    selectedStripIds.includes(strip.id)
  );

  const selectedKeyframeIds = useSelector(
    (state) => state.scene.selectedKeyframeIds
  );

  const fps = useSelector((state) => state.scene.fps);
  const currentTime = useSelector((state) => state.scene.currentTime);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(1);

  const handleMouseDownTimeView = getDragHander<number, void>(
    ({ diffX, pass }) => {
      const newCurrentTime = pass + diffX / pxPerSec;
      if (newCurrentTime >= 0 && newCurrentTime <= strip.length + strip.start) {
        dispatch(actions.setCurrentTime(roundToFrame(newCurrentTime, fps)));
      }
    },
    ({ startEvent: e }) => {
      // TODO fix magic number
      const newCurrentTime =
        (e.clientX - 40) / pxPerSec + start * strip.length + strip.start;
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
    setPxPerSec(width / ((end - start) * strip.length));
  }, [width, start, end, selectedStrips]);
  const dispatch = useDispatch();
  const [rect, setRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (rect) {
      const selectedKeyframes = allKeyframes.filter((keyframe) => {
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
  }, [rect]);

  if (selectedStrips.length !== 1) {
    return <Panel width={100} height={100} />;
  }
  const strip = selectedStrips[0];

  const allKeyframes = strip.effects.flatMap((effect) => {
    if ("keyframes" in effect) {
      return effect.keyframes;
    }
    return [];
  }) as KeyFrame[];
  const uniqueProperties = new Set(
    allKeyframes.map((keyframe) => keyframe.property)
  );

  const handleMouseDownKeyFrame = (keyframe: KeyFrame) =>
    getDragHander<
      {
        firstKeyframes: KeyFrame[];
        updatedKeyframeIds: string[];
        firstStrips: Strip[];
      },
      {
        updatedStrips: Strip[];
      } | null
    >(
      (ctx) => {
        const { diffX, pass } = ctx;
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
          if (!isTextEffect(effect)) {
            return;
          }
          const newEffect = {
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
            actions.updateEddect({
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
      (ctx) => {
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
        dispatch(actions.setSelectKeyframeIds([]));
      }
    }
  );

  return (
    <Panel width={100} height={50}>
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        <div>
          <div style={{ height: "16px", width: "32px" }}></div>
          <div>
            {strip.effects.map((effect, i) => {
              if ("keyframes" in effect && Array.isArray(effect.keyframes)) {
                return Array.from(uniqueProperties).map((property, j) => {
                  return (
                    <div
                      key={`${i}${j}`}
                      style={{
                        height: "16px",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      {property}
                    </div>
                  );
                });
              }
            })}
          </div>
        </div>
        <div
          ref={ref}
          style={{ width: "100%", position: "relative", overflow: "hidden" }}
        >
          <TimeView
            endSec={strip.length}
            offsetSec={start * strip.length}
            pxPerSec={pxPerSec}
            fps={fps}
            frameMode={true}
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
            <SelectRect
              $height={rect?.height ?? 0}
              $left={rect?.left ?? 0}
              $top={rect?.top ?? 0}
              $width={rect?.width ?? 0}
            ></SelectRect>
            {strip.effects.map((effect, i) => {
              if (isTextEffect(effect)) {
                return effect.keyframes.map((keyframe, j) => {
                  const x = (keyframe.time - start * strip.length) * pxPerSec;
                  const propertiesIndex = Array.from(uniqueProperties).indexOf(
                    keyframe.property
                  );
                  return (
                    <div
                      key={`${i}${j}`}
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
                });
              }
              return null;
            })}
          </div>
          <ScaleScrollBar
            start={start}
            end={end}
            onScaleChange={(start, end) => {
              setStart(start);
              setEnd(end);
            }}
          />
        </div>
      </div>
    </Panel>
  );
};
