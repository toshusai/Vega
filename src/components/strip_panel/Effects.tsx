import { FC } from "react";
import { useDispatch } from "react-redux";
import { css } from "styled-components";
import { Trash } from "tabler-icons-react";

import { iconProps, TransparentIconButton } from "@/app-ui/src";
import {
  Effect,
  isAudioEffect,
  isImageEffect,
  isScriptEffect,
  isTextEffect,
  isVideoEffect,
  Strip,
} from "@/core/types";
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
          <div key={effect.id}>
            <div
              css={css`
                display: flex;
              `}
            >
              <strong
                style={{
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
