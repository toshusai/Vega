import { FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";
import { Music, Photo, Plus, Tex, Video } from "tabler-icons-react";

import {
  DropdownMenu,
  IconButton,
  iconProps,
  StyledContextMenuButton,
  ToolTip,
} from "@/app-ui/src";
import { useClickOutside } from "@/components/keyframes_panel/useClickOutside";
import {
  AudioEffect,
  Effect,
  ImageEffect,
  Strip,
  TextEffect,
  VideoEffect,
} from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";

export const AddStripButton: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { show, setShow, handleClick, onMouseLeave } = useClickOutside(ref);

  const newIconProps = {
    ...iconProps,
    style: {
      ...iconProps.style,
      marginLeft: "0px",
      marginRight: "0px",
    },
  };

  const dispatch = useDispatch();
  const currentTime = useSelector((state) => state.scene.currentTime);
  const margin = 1;
  const strips = useSelector((state) =>
    state.scene.strips.filter(
      (s) =>
        s.start <= currentTime + margin && s.start + s.length >= currentTime
    )
  );

  const getAvailableLayers = () => {
    const emptyLayers = Array.from({ length: 4 }, (_, i) => i);
    const usedLayers = strips.map((s) => s.layer);
    const availableLayers = emptyLayers.filter((l) => !usedLayers.includes(l));
    if (availableLayers.length === 0) {
      alert("You can't add more than 3 strips at the same time");
      return null;
    }
    const layer = availableLayers[0];

    if (layer > 3) {
      alert("You can't add more than 3 strips at the same time");
      return null;
    }
    return layer;
  };

  const getNewStrip = (layer: number, time: number): Strip => {
    const newStrip: Strip = {
      id: uuid(),
      effects: [],
      layer: layer,
      length: 1,
      start: time,
    };
    return newStrip;
  };

  const addNewStripWithEffect = (effect: Effect) => {
    setShow(false);
    const layer = getAvailableLayers();
    if (layer === null) return;
    dispatch(
      actions.updateStrip({
        ...getNewStrip(layer, currentTime),
        effects: [effect],
      })
    );
  };

  const handleAddTextStrip = () => {
    const effect: TextEffect = {
      id: uuid(),
      type: "text",
      text: "New Text",
      fontSize: 24,
      fontAssetId: "",
      keyframes: [],
      color: "#ffffff",
      fontStyle: "normal",
      outlineColor: "#000000",
      outlineWidth: 0,
      shadowBlur: 0,
      shadowColor: "#000000",
      x: 0,
      y: 0,
    };
    addNewStripWithEffect(effect);
  };

  const handleAddImageStrip = () => {
    const effect: ImageEffect = {
      id: uuid(),
      type: "image",
      imageAssetId: "",
      opacity: 1,
      keyframes: [],
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
    };
    addNewStripWithEffect(effect);
  };

  const handleAddVideoStrip = () => {
    const effect: VideoEffect = {
      id: uuid(),
      type: "video",
      videoAssetId: "",
      keyframes: [],
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
    };
    addNewStripWithEffect(effect);
  };

  const handleAddAudioStrip = () => {
    const effect: AudioEffect = {
      id: uuid(),
      type: "audio",
      audioAssetId: "",
      volume: 1,
      offset: 0,
      keyframes: [],
    };
    addNewStripWithEffect(effect);
  };

  return (
    <div
      ref={ref}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <IconButton onClick={handleClick}>
        <Plus {...iconProps} />
        <ToolTip>
          Add Strip
        </ToolTip>
      </IconButton>
      {show && (
        <DropdownMenu>
          <StyledContextMenuButton onClick={handleAddTextStrip}>
            <Tex {...newIconProps}></Tex>
            <div style={{ marginLeft: "4px" }}>Add Text Strip</div>
          </StyledContextMenuButton>
          <StyledContextMenuButton onClick={handleAddVideoStrip}>
            <Video {...newIconProps}></Video>
            <div style={{ marginLeft: "4px" }}>Add Video Strip</div>
          </StyledContextMenuButton>
          <StyledContextMenuButton onClick={handleAddImageStrip}>
            <Photo {...newIconProps}></Photo>
            <div style={{ marginLeft: "4px" }}>Add Image Strip</div>
          </StyledContextMenuButton>
          <StyledContextMenuButton onClick={handleAddAudioStrip}>
            <Music {...newIconProps}></Music>
            <div style={{ marginLeft: "4px" }}>Add Audio Strip</div>
          </StyledContextMenuButton>
        </DropdownMenu>
      )}
    </div>
  );
};
