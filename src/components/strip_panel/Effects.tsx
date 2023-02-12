import { FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { css } from "styled-components";
import { Plus, Trash } from "tabler-icons-react";

import { Button } from "@/components/Button";
import { useClickOutside } from "@/components/keyframes_panel/useClickOutside";
import {
  Effect,
  isAudioEffect,
  isImageEffect,
  isScriptEffect,
  isTextEffect,
  isVideoEffect,
  Strip,
} from "@/core/types";
import { userScriptMap } from "@/rendering/updateScriptEffect";
import {
  DropdownMenu,
  iconProps,
  StyledContextMenuButton,
  TransparentIconButton,
} from "@/riapp-ui/src";
import { actions } from "@/store/scene";

import { AudioEffectView } from "./effects/audio/AudioEffectView";
import { ImageEffectView } from "./effects/image/ImageEffectView";
import { TextEffectView } from "./effects/text/TextEffectView";
import { VideoEffectView } from "./effects/video/VideoEffectView";
import { ScriptEffectView } from "./ScriptEffectView";

export const Effects: FC<{ effects: Effect[]; strip: Strip }> = (props) => {
  const { effects } = props;

  const dispatch = useDispatch();

  const handleDeleteEffect = (effect: Effect) => {
    dispatch(
      actions.updateStrip({
        ...props.strip,
        effects: props.strip.effects.filter((e) => e.id !== effect.id),
      })
    );
  };

  return (
    <div>
      {effects.map((effect) => {
        return (
          <div key={effect.id} style={{ marginTop: "8px" }}>
            <div
              css={css`
                display: flex;
              `}
            >
              <strong
                style={{
                  marginBottom: "4px",
                  display: "block",
                }}
              >
                {effect.type}
              </strong>
              {isScriptEffect(effect) && (
                <div>
                  <TransparentIconButton
                    onClick={() => {
                      handleDeleteEffect(effect);
                    }}
                  >
                    <Trash {...iconProps}></Trash>
                  </TransparentIconButton>
                </div>
              )}
            </div>
            {isTextEffect(effect) && (
              <TextEffectView textEffect={effect} strip={props.strip} />
            )}
            {isVideoEffect(effect) && (
              <VideoEffectView videoEffect={effect} strip={props.strip} />
            )}
            {isImageEffect(effect) && (
              <ImageEffectView imageEffect={effect} strip={props.strip} />
            )}
            {isAudioEffect(effect) && (
              <AudioEffectView audioEffect={effect} strip={props.strip} />
            )}
            {isScriptEffect(effect) && (
              <ScriptEffectView scriptEffect={effect} strip={props.strip} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const AddEffectButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { show, onMouseLeave, setShow } = useClickOutside(ref);

  let names: string[] = [];
  for (const [, ep] of userScriptMap.entries()) {
    names.push(ep.pkg?.name ?? "");
  }

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
      <Button
        onClick={() => setShow((v) => !v)}
        css={css`
          display: flex;
        `}
      >
        <Plus {...iconProps}></Plus>
        <div>add effects</div>
      </Button>
      {show && (
        <DropdownMenu>
          {names.map((name, i) => {
            return (
              <StyledContextMenuButton key={i}>{name}</StyledContextMenuButton>
            );
          })}
        </DropdownMenu>
      )}
    </div>
  );
};
