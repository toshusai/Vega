import { FC, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";
import { Photo, Plus, Tex, Video } from "tabler-icons-react";
import { Effect } from "../interfaces/effects/Effect";
import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/effects/TextEffect";
import { VideoEffect } from "../interfaces/effects/VideoEffect";
import { ImageEffect } from "../interfaces/effects/ImageEffect";
import { DropdownMenu } from "../pages/DropdownMenu";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { StyledContextMenuButton } from "./ContextMenu";
import { IconButton } from "./IconButton";
import { iconProps } from "./iconProps";

export const AddStripButton: FC = () => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setShow(!show);
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && ref.current.contains(e.target as Node)) {
        return;
      }
      setShow(false);
      window.removeEventListener("mousedown", handleMouseDown, {
        capture: true,
      });
    };
    window.addEventListener("mousedown", handleMouseDown, {
      capture: true,
    });
  };
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const onMouseLeave = () => {
    const id = setTimeout(() => {
      if (timeoutId) {
        setShow(false);
      }
    }, 100);
    setTimeoutId(id);
  };

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
      fontAssetId: null,
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
      scaleX: 1,
      scaleY: 1,
    };
    addNewStripWithEffect(effect);
  };

  const handleAddVideoStrip = () => {
    const effect: VideoEffect = {
      id: uuid(),
      type: "video",
      videoAssetId: "",
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
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
        </DropdownMenu>
      )}
    </div>
  );
};
