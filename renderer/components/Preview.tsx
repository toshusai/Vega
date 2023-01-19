import { FC, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { isTextEffect } from "../interfaces/TextEffect";
import { isVideoEffect } from "../interfaces/VideoEffect";
import store from "../store";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { Panel, PanelInner } from "./core/Panel";
import { updateTextEffect } from "../rendering/updateTextEffect";
import { updateVideoEffect } from "../rendering/updateVideoEffect";

export const Preview: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useSelector((state) => state.scene.initialized);
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialized) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    dispatch(actions.setInitialized(true));
    const ctx = canvas.getContext("2d");
    const update = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const scene = store.getState().scene;

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
    update();
  }, []);
  const memolizedCanvas = useMemo(() => {
    return <canvas ref={canvasRef} />;
  }, []);
  return <Panel>{memolizedCanvas}</Panel>;
};
