import { FC, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { isTextEffect } from "../interfaces/TextEffect";
import store from "../store";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { Panel, PanelInner } from "./core/Panel";

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

      for (const strip of scene.strips) {
        if (
          scene.currentTime < strip.start ||
          scene.currentTime > strip.start + strip.length
        ) {
          continue;
        }

        for (const effect of strip.effects) {
          if (isTextEffect(effect)) {
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText(effect.text, effect.x, effect.y);
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
  return (
    <Panel>
      <PanelInner>{memolizedCanvas}</PanelInner>
    </Panel>
  );
};
