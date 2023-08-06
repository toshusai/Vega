import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { ZoomIn, ZoomOut, ZoomReset } from "tabler-icons-react";

import { Gizmo } from "@/components/preview_panel/Gizmo";
import {
  isAudioEffect,
  isImageEffect,
  isScriptEffect,
  isTextEffect,
  isVideoEffect,
} from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { Key, KeyboardInput } from "@/KeyboardInput";
import { Recorder } from "@/rendering/recorder";
import { updateAudioEffect } from "@/rendering/updateAudioEffect";
import { updateImageEffect } from "@/rendering/updateImageEffect";
import { handler } from "@/rendering/updateScriptEffect";
import { updateTextEffect } from "@/rendering/updateTextEffect";
import { updateVideoEffect } from "@/rendering/updateVideoEffect";
import {
  BottomToolTip,
  Card,
  getDragHander,
  IconButton,
  iconProps,
} from "@/riapp-ui/src";
import store from "@/store";
import { actions } from "@/store/scene";
import { download } from "@/utils/download";
import { roundToFrame } from "@/utils/roundToFrame";

import { CurrentTime } from "./CurrentTime";
import { useHandleSelectStrip } from "./useHandleSelectStrip";

export const Preview: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useSelector((state) => state.scene.initialized);
  const width = useSelector((state) => state.scene.canvasWidth);
  const height = useSelector((state) => state.scene.canvasHeight);
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement>(null);

  const fps = useSelector((state) => state.scene.fps);

  const left = useSelector((state) => state.scene.canvasLeft ?? 0);
  const top = useSelector((state) => state.scene.canvasTop ?? 0);
  const scale = useSelector((state) => state.scene.canvasScale ?? 1);
  const setLeft = useCallback(
    (newLeft: number) => {
      dispatch(actions.setLeft(newLeft));
    },
    [dispatch]
  );
  const setTop = useCallback(
    (newTop: number) => {
      dispatch(actions.setTop(newTop));
    },
    [dispatch]
  );
  const setScale = useCallback(
    (newScale: number) => {
      dispatch(actions.setScale(newScale));
    },
    [dispatch]
  );

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
    [left, scale, setLeft, setScale, setTop, top]
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
  }, [changeScale, height, setLeft, setTop, width]);

  const handleMouseDown = useCallback(
    (e: any) =>
      getDragHander<{ left: number; top: number }, null>(
        (ctx) => {
          if (dragging && ctx.pass) {
            setLeft(ctx.diffX + ctx.pass.left);
            setTop(ctx.diffY + ctx.pass.top);
          }
          return null;
        },
        () => {
          return {
            left: left,
            top: top,
          };
        }
      )(e),
    [dragging, setLeft, setTop, left, top]
  );

  const handleMouseDownForSelect = useHandleSelectStrip();

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
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.imageSmoothingQuality = "low";
    ctx.imageSmoothingEnabled = false;
    let prevTime = 0;

    const recorder = new Recorder(canvas);

    const update = (t: number) => {
      if (!ctx) return;
      const delta = t - prevTime;
      delta;
      prevTime = t;

      const scene = store.getState().scene;
      if (scene.recordingState === "recording" && !recorder.isRecording()) {
        recorder.onEnd = (blob) => {
          dispatch(actions.setRecordingState("idle"));
          dispatch(actions.setCurrentTime(0));
          dispatch(actions.setIsPlaying(false));
          download(blob, "video.webm");
        };

        recorder.start(scene);
      }
      if (
        scene.recordingState === "recording" &&
        recorder.isRecording() &&
        scene.currentTime > scene.length
      ) {
        recorder.stop();
      }
      if (scene.recordingState === "paused") {
        recorder.stop();
      }
      if (scene.isPlaying) {
        dispatch(
          actions.setCurrentTime(
            roundToFrame(scene.currentTime + 1 / (fps - 1), fps)
          )
        );
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
  }, [left, top, scale, initialized, dispatch, resetScale, fps]);
  return (
    <Card width={100} height={100}>
      <RootDiv
        ref={rootRef}
        id={PreviewRootID}
        onMouseDown={(e) => {
          handleMouseDown(e);
          handleMouseDownForSelect(e.nativeEvent);
        }}
        onWheel={handleWheel}
      >
        <BarDiv>
          <CurrentTime />

          <IconButton
            onClick={() => {
              changeScale(scale * 0.9, true);
            }}
          >
            <ZoomOut {...iconProps} />
            <BottomToolTip>Zoom Out</BottomToolTip>
          </IconButton>
          <ScaleDiv>{(scale * 100).toFixed(0) + "%"}</ScaleDiv>
          <IconButton
            onClick={() => {
              changeScale(scale * 1.1, true);
            }}
          >
            <ZoomIn {...iconProps} />
            <BottomToolTip>Zoom In</BottomToolTip>
          </IconButton>

          <IconButton
            onClick={() => {
              resetScale();
            }}
          >
            <ZoomReset {...iconProps} />
            <BottomToolTip>Reset Zoom</BottomToolTip>
          </IconButton>
        </BarDiv>
        <Canvas
          style={{
            left: left + "px",
            top: top + "px",
            transform: `scale(${scale})`,
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
      </RootDiv>
    </Card>
  );
};

const Canvas = styled.canvas`
  position: absolute;
  pointer-events: none;
  transform-origin: top left;
  image-rendering: pixelated;
`;

const ScaleDiv = styled.div`
  height: 16px;
  display: flex;
  font-size: 12px;
  margin: auto 4px;
  align-items: center;
  font-family: "Ricty Diminished";
  color: white;
`;

const BarDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
  z-index: 2;
  position: relative;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
`;

const RootDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const PreviewRootID = "preview-root";
