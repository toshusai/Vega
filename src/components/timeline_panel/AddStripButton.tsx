import { FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";
import { Music, Photo, Plus, Tex, Video } from "tabler-icons-react";

import { AudioEffect } from "@/interfaces/effects/AudioEffect";
import { Effect , Strip } from "@/packages/types";

import { ImageEffect } from "../../interfaces/effects/ImageEffect";
import { TextEffect } from "../../interfaces/effects/TextEffect";
import { VideoEffect } from "../../interfaces/effects/VideoEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { StyledContextMenuButton } from "../core/context_menu/ContextMenu";
import { iconProps } from "../core/iconProps";
import { IconButton } from "../core/styled/IconButton";
import { DropdownMenu } from "../DropdownMenu";
import { useClickOutside } from "../keyframes_panel/useClickOutside";

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
    if (!layer) return;
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
      text: "New Text Strip",
      fontSize: 24,
      fontAssetId: "",
      keyframes: [],
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
