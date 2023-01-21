import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { isTextEffect } from "../interfaces/TextEffect";
import { isVideoEffect } from "../interfaces/VideoEffect";
import store from "../store";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { Panel, PanelInner } from "./core/Panel";
import { updateTextEffect } from "../rendering/updateTextEffect";
import { updateVideoEffect } from "../rendering/updateVideoEffect";
import { Key, KeyboardInput } from "../KeyboardInput";
import { getDragHander } from "./getDragHander";
import { Focus, ZoomIn, ZoomOut, ZoomReset } from "tabler-icons-react";
import styled from "styled-components";

export const Preview: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useSelector((state) => state.scene.initialized);
  const width = useSelector((state) => state.scene.canvasWidth);
  const height = useSelector((state) => state.scene.canvasHeight);
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement>(null);

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [scale, setScale] = useState(0.3);

  const changeScale = (newScale: number, center?: boolean) => {
    if (newScale < 0.1) {
      newScale = 0.1;
    }
    if (newScale > 2) {
      newScale = 2;
    }
    setScale(newScale);
    if (center) {
      const el = rootRef.current as HTMLDivElement;
      const rect = el.getBoundingClientRect();
      const deltaScale = newScale / scale;
      const distanceX = rect.width / 2 - left;
      const distanceY = rect.height / 2 - top;
      setLeft(left + distanceX * (1 - deltaScale));
      setTop(top + distanceY * (1 - deltaScale));
    }
    return newScale;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = rootRef.current as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    let newScale = scale + e.deltaY * 0.001 * scale;
    newScale = changeScale(newScale);
    const deltaScale = newScale / scale;
    const distanceX = e.clientX - rect.left - left;
    const distanceY = e.clientY - rect.top - top;
    setLeft(left + distanceX * (1 - deltaScale));
    setTop(top + distanceY * (1 - deltaScale));
  };

  const handleMouseDown = getDragHander<{ left: number; top: number }, null>(
    (ctx) => {
      setLeft(ctx.diffX + ctx.pass.left);
      setTop(ctx.diffY + ctx.pass.top);
      return null;
    },
    (ctx) => {
      return {
        left: left,
        top: top,
      };
    }
  );

  useEffect(() => {
    if (initialized) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    KeyboardInput.addKeyDownListener(Key.Space, (e) => {
      if (document.activeElement == document.body) {
        e.preventDefault();
        dispatch(actions.toggleIsPlaying());
      }
    });
    const el = rootRef.current as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    setLeft(rect.width / 2 - (width * scale) / 2);
    setTop(rect.height / 2 - (height * scale) / 2);

    KeyboardInput.addKeyDownListener(Key.Space, () => {
      const el = rootRef.current as HTMLDivElement;
      el.style.cursor = "grab";
    });
    KeyboardInput.addKeyUpListener(Key.Space, () => {
      const el = rootRef.current as HTMLDivElement;
      el.style.cursor = "";
    });
    dispatch(actions.setInitialized(true));
    const ctx = canvas.getContext("2d");
    let prevTime = 0;

    const update = (t) => {
      const delta = t - prevTime;
      prevTime = t;

      const scene = store.getState().scene;
      if (scene.isPlaying) {
        dispatch(actions.setCurrentTime(scene.currentTime + delta / 1000));
      }

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const layerOrderedIndeiexes = scene.strips
        .map((s, i) => ({
          layer: s.layer,
          i,
        }))
        .sort((a, b) => a.layer - b.layer)
        .map((s) => s.i);

      for (const i of layerOrderedIndeiexes) {
        const strip = scene.strips[i];
        for (const effect of strip.effects) {
          if (isTextEffect(effect)) {
            updateTextEffect(ctx, effect, strip, scene);
          } else if (isVideoEffect(effect)) {
            updateVideoEffect(ctx, effect, strip, scene);
          }
        }
      }

      requestAnimationFrame(update);
    };
    update(0);
  }, [left, top, scale, initialized, dispatch]);
  return (
    <Panel>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
        ref={rootRef}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2px",
            zIndex: 2,
            position: "relative",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <IconButton
            onClick={() => {
              changeScale(scale * 0.9, true);
            }}
          >
            <ZoomOut {...iconProps} />
          </IconButton>
          <div
            style={{
              height: "16px",
              display: "flex",
              fontSize: "12px",
              margin: "auto 4px",
              alignItems: "center",
              fontFamily: "Ricty Diminished",
              color: "white",
            }}
          >
            {(scale * 100).toFixed(0) + "%"}
          </div>
          <IconButton
            onClick={() => {
              changeScale(scale * 1.1, true);
            }}
          >
            <ZoomIn {...iconProps} />
          </IconButton>

          <IconButton onClick={() => {}}>
            <ZoomReset {...iconProps} />
          </IconButton>
        </div>
        <canvas
          style={{
            position: "absolute",
            pointerEvents: "none",
            transformOrigin: "top left",
            left: left + "px",
            top: top + "px",
            transform: `scale(${scale})`,
            imageRendering: "pixelated",
          }}
          width={width}
          height={height}
          ref={canvasRef}
        />
      </div>
    </Panel>
  );
};

export const IconButton = styled.button`
  padding: 0;
  width: 16px;
  min-height: 16px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  display: flex;
  border-radius: 4px;
  background-color: var(--color-input-background);
`;

export const iconProps = {
  style: { margin: "auto" },
  strokeWidth: 2,
  color: "white",
  size: 12,
};
