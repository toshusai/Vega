import { CSSProperties, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useWidth } from "../hooks/useWidth";
import { isTextEffect, KeyFrame } from "../interfaces/TextEffect";
import { Key, KeyboardInput } from "../KeyboardInput";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { Panel } from "./core/Panel";
import { easeInExpo } from "./easing";
import { getDragHander } from "./getDragHander";
import { SelectRect } from "./SelectRect";
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

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(1);
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
        const left = keyframe.time * pxPerSec;
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
    return <Panel />;
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
      },
      {
        updatedKeyframes: Keyframe[];
      } | null
    >(
      (ctx) => {
        const { diffX, pass } = ctx;
        const newSelectedKFIds = pass.updatedKeyframeIds;
        const selectedKFs = allKeyframes
          .filter((strip) => newSelectedKFIds.includes(strip.id))
          .sort((a, b) => a.time - b.time);

        const newKFs = selectedKFs.map((keyframe) => {
          const newTime = keyframe.time + diffX / pxPerSec;
          return {
            ...keyframe,
            time: newTime,
          };
        });

        strip.effects.forEach((effect) => {
          if (!isTextEffect(effect)) {
            return;
          }
          dispatch(
            actions.updateEddect({
              stripId: strip.id,
              effect: {
                ...effect,
                keyframes: effect.keyframes.map((kf) => {
                  const newK = newKFs.find((m) => m.id === kf.id);
                  if (newK) {
                    return newK;
                  }
                  return kf;
                }),
              },
            })
          );
        });

        return null;
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
        };
      },
      (ctx) => {
        // todo impl select single
        // todo impl revert invalid
        // todo impl commit
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
    <Panel>
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
        <div ref={ref} style={{ width: "100%" }}>
          <TimeView
            endSec={10}
            offsetSec={0}
            pxPerSec={pxPerSec}
            fps={60}
            frameMode={true}
          />

          <div
            style={{
              display: "flex",
              position: "relative",
              height: "100%",
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
              if ("keyframes" in effect && Array.isArray(effect.keyframes)) {
                return effect.keyframes.map((keyframe, j) => {
                  const x = keyframe.time * pxPerSec;
                  const propertiesIndex = Array.from(uniqueProperties).indexOf(
                    keyframe.property
                  );
                  return (
                    <div
                      key={`${i}${j}`}
                      onMouseDown={handleMouseDownKeyFrame(keyframe)}
                    >
                      <MmakeSVG
                        f={easeInExpo}
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
        </div>
      </div>
    </Panel>
  );
};

const MmakeSVG: FC<{ f: (x: number) => number; style: CSSProperties }> = (
  props
) => {
  const points = [];
  const padding = 4;
  const width = 16;
  const height = 12;
  const step = 100;
  for (let i = 0; i < step; i++) {
    const x = i / step;
    const y = props.f(x);
    points.push(`${padding + x * width} ${padding + (1 - y) * height}`);
  }
  const d = `M ${points.join(" ")}`;
  return (
    <svg
      style={props.style}
      width={width}
      height={height}
      viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
      preserveAspectRatio="none"
      strokeWidth={2}
    >
      <rect
        x={0}
        y={0}
        width={width + padding * 2}
        height={height + padding * 2}
        fill="none"
        stroke="var(--color-border)"
      />
      <path d={d} stroke="var(--color-primary)" fill="none" />
      <circle
        cx={padding}
        cy={padding + height}
        r="2"
        fill="var(--color-text-strip-border)"
      />
      <circle
        cx={padding + width}
        cy={padding}
        r="2"
        fill="var(--color-text-strip-border)"
      />
    </svg>
  );
};
