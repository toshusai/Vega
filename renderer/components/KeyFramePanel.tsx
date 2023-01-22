import { CSSProperties, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useWidth } from "../hooks/useWidth";
import { KeyFrame } from "../interfaces/TextEffect";
import { Key, KeyboardInput } from "../KeyboardInput";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { Panel } from "./core/Panel";
import { easeInExpo } from "./easing";
import { getDragHander } from "./getDragHander";
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
      (ctx) => {}
    );

  return (
    <Panel>
      <div
        style={{
          display: "flex",
        }}
      >
        <div>
          <div style={{ height: "16px", width: "32px" }}></div>
          <div>
            {strip.effects.map((effect, i) => {
              if ("keyframes" in effect && Array.isArray(effect.keyframes)) {
                const uniqueProperties = new Set(
                  effect.keyframes.map((keyframe) => keyframe.property)
                );
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
            }}
          >
            {strip.effects.map((effect, i) => {
              if ("keyframes" in effect && Array.isArray(effect.keyframes)) {
                const uniqueProperties = new Set(
                  effect.keyframes.map((keyframe) => keyframe.property)
                );
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
