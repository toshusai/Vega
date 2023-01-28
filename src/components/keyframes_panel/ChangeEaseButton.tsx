import { actions } from "@/store/scene";
import { useSelector } from "@/store/useSelector";
import { UndoManager } from "@/UndoManager";
import {
  allEase,
  easeInCubic,
  getEasingFunction,
} from "@/utils/easing";
import { FC, useRef } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { StyledContextMenuButton } from "../core/context_menu/ContextMenu";
import { iconProps } from "../core/iconProps";
import { IconButton } from "../core/styled/IconButton";
import { DropdownMenu } from "../DropdownMenu";
import { hasKeyFrame } from "./KeyFramePanel";
import { MakeSVG } from "./MakeSVG";
import { useClickOutside } from "./useClickOutside";

export const ChangeEaseButton: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { show, setShow, handleClick, onMouseLeave } = useClickOutside(ref);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const selectedStrips = strips.filter((strip) =>
    selectedStripIds.includes(strip.id)
  );
  const selectedKeyframeIds = useSelector(
    (state) => state.scene.selectedKeyframeIds
  );
  const strip = selectedStrips[0];
  const dispatch = useDispatch();
  if (!strip) return null;
  const changeEase = (ease: string) => {
    if (!strip) return;
    setShow(false);
    const newEffects = strip.effects.map((effect) => {
      if (!hasKeyFrame(effect)) {
        return effect;
      }
      const newKeyframes = effect.keyframes.map((keyframe) => {
        if (!selectedKeyframeIds.includes(keyframe.id)) return keyframe;
        return {
          ...keyframe,
          ease: ease,
        };
      });
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

  return (
    <Box ref={ref} onMouseLeave={onMouseLeave} style={{}}>
      <IconButton onClick={handleClick}>
        <MakeSVG
          width={12}
          height={12}
          f={easeInCubic}
          style={{
            ...iconProps.style,
          }}
          lineColor="white"
          circleColor="lightgray"
          hideBorder
        />
      </IconButton>
      {show && (
        <DropdownMenu>
          {allEase.map((ease, i) => {
            return (
              <StyledContextMenuButton
                onClick={() => {
                  changeEase(ease);
                }}
                key={i}
              >
                <MakeSVG
                  f={getEasingFunction(ease)}
                  lineColor="white"
                  circleColor="lightgray"
                  hideBorder
                />
                <div style={{ marginLeft: "4px" }}>{toUpperFirst(ease)}</div>
              </StyledContextMenuButton>
            );
          })}
        </DropdownMenu>
      )}
    </Box>
  );
};

function toUpperFirst(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

const Box = styled.div`
  display: flex;
  position: relative;
  box-sizing: border-box;
  /* --color-primary: white; */
  /* --color-text-strip-border: white; */
`;
