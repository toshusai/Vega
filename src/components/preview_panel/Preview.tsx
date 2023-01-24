import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { isTextEffect } from "../../interfaces/effects/utils/isTextEffect";
import { isVideoEffect } from "../../interfaces/effects/utils/isVideoEffect";
import { isImageEffect } from "../../interfaces/effects/utils/isImageEffect";
import store from "../../store";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { Panel } from "../core/Panel";
import {
  isAudioAsset,
  isImageAsset,
  updateTextEffect,
} from "../../rendering/updateTextEffect";
import { updateVideoEffect } from "../../rendering/updateVideoEffect";
import { Key, KeyboardInput } from "../../KeyboardInput";
import { getDragHander } from "../../utils/getDragHander";
import { ZoomIn, ZoomOut, ZoomReset } from "tabler-icons-react";
import { textEffectToRect } from "./utils/textEffectToRect";
import { Gizmo } from "../preview_panel/Gizmo";
import { IconButton } from "../core/styled/IconButton";
import { iconProps } from "../core/iconProps";
import { updateImageEffect } from "../../rendering/updateImageEffect";
import { updateAudioEffect } from "@/rendering/updateAudioEffect";
import { isAudioEffect } from "@/interfaces/effects/utils/isAudioEffect";
import { isScriptAsset } from "@/interfaces/asset/ScriptAsset";
import { handler } from "@/rendering/updateScriptEffect";
import { isScriptEffect } from "@/interfaces/effects/ScriptEffect";

export const Preview: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useSelector((state) => state.scene.initialized);
  const width = useSelector((state) => state.scene.canvasWidth);
  const height = useSelector((state) => state.scene.canvasHeight);
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement>(null);

  const strips = useSelector((state) => state.scene.strips);
  const fps = useSelector((state) => state.scene.fps);

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [scale, setScale] = useState(0.3);
  const [dragging, setDragging] = useState(false);

  const changeScale = useCallback(
    (newScale: number, center?: boolean) => {
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
    },
    [left, scale, top]
  );

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

  const resetScale = useCallback(() => {
    changeScale(0.3, true);
    const el = rootRef.current as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    setLeft(rect.width / 2 - (width * 0.3) / 2);
    setTop(rect.height / 2 - (height * 0.3) / 2);
  }, [changeScale, height, width]);

  const currentTime = useSelector((state) => state.scene.currentTime);

  const handleMouseDown = getDragHander<{ left: number; top: number }, null>(
    (ctx) => {
      if (dragging && ctx.pass) {
        setLeft(ctx.diffX + ctx.pass.left);
        setTop(ctx.diffY + ctx.pass.top);
      }
      return null;
    },
    (ctx) => {
      if (KeyboardInput.isPressed(Key.Alt)) {
        return {
          left: left,
          top: top,
        };
      }
      const el = rootRef.current as HTMLDivElement;
      const rect = el.getBoundingClientRect();

      const clickXInRootSpace = ctx.startEvent.clientX - rect.left;
      const clickYInRootSpace = ctx.startEvent.clientY - rect.top;

      strips.forEach((strip) => {
        strip.effects.forEach((effect) => {
          if (isTextEffect(effect)) {
            const rect = textEffectToRect(
              effect,
              scale,
              left,
              top,
              currentTime - strip.start,
              fps
            );
            if (
              rect &&
              clickXInRootSpace > rect.$left &&
              clickXInRootSpace < rect.$left + rect.$width &&
              clickYInRootSpace > rect.$top &&
              clickYInRootSpace < rect.$top + rect.$height
            ) {
              dispatch(actions.setSelectedStripIds([strip.id]));
            }
          }
        });
      });

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
    resetScale();
    KeyboardInput.addKeyDownListener(Key.Alt, () => {
      const el = rootRef.current as HTMLDivElement;
      el.style.cursor = "grab";
      setDragging(true);
    });
    KeyboardInput.addKeyUpListener(Key.Alt, () => {
      const el = rootRef.current as HTMLDivElement;
      el.style.cursor = "";
      setDragging(false);
    });
    dispatch(actions.setInitialized(true));
    const ctx = canvas.getContext("2d");
    let prevTime = 0;

    const update = (t: number) => {
      if (!ctx) return;
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

      const effetIdUpdateMap: {
        [id: string]:
          | {
              update: () => void;
              beforeUpdate: () => void;
            }
          | undefined;
      } = {};
      for (const i of layerOrderedIndeiexes) {
        const strip = scene.strips[i];
        for (const effect of strip.effects) {
          if (isScriptEffect(effect)) {
            const result = handler(ctx, effect, strip, scene, {
              dispatch,
              actions,
            });
            if (result) {
              effetIdUpdateMap[effect.id] = result;
              result.beforeUpdate();
            }
          }
        }
      }
      for (const i of layerOrderedIndeiexes) {
        const strip = scene.strips[i];
        for (const effect of strip.effects) {
          if (isTextEffect(effect)) {
            updateTextEffect(ctx, effect, strip, scene);
          } else if (isVideoEffect(effect)) {
            updateVideoEffect(ctx, effect, strip, scene);
          } else if (isImageEffect(effect)) {
            updateImageEffect(ctx, effect, strip, scene);
          } else if (isAudioEffect(effect)) {
            updateAudioEffect(ctx, effect, strip, scene);
          } else if (isScriptEffect(effect)) {
            effetIdUpdateMap[effect.id]?.update();
          }
        }
      }

      requestAnimationFrame(update);
    };
    update(0);
  }, [left, top, scale, initialized, dispatch, resetScale]);
  return (
    <Panel width={100} height={100}>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
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

          <IconButton
            onClick={() => {
              resetScale();
            }}
          >
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
        <Gizmo
          userSelectNone={dragging}
          onWheel={handleWheel}
          left={left}
          top={top}
          scale={scale}
        />
      </div>
    </Panel>
  );
};
