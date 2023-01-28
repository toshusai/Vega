import { FC } from "react";
import { useDispatch } from "react-redux";

import { Effect , isAudioEffect , isImageEffect , isScriptEffect , isTextEffect , isVideoEffect,Strip  } from "@/packages/types";
import { actions } from "@/store/scene";

import { AudioEffectView } from "./AudioEffectView";
import { ImageEffectView } from "./ImageEffectView";
import { ScriptEffectView } from "./ScriptEffectView";
import { TextEffectView } from "./TextEffectView";
import { VideoEffectView } from "./VideoEffectView";

export const Effects: FC<{ effects: Effect[]; strip: Strip }> = (props) => {
  const { effects } = props;
  const dispatch = useDispatch();

  return (
    <div>
      {effects.map((effect) => {
        return (
          <div key={effect.id} style={{ marginTop: "8px" }}>
            <strong
              style={{
                marginBottom: "4px",
                display: "block",
              }}
            >
              {effect.type}
            </strong>
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
              <ScriptEffectView
                scriptEffect={effect}
                strip={props.strip}
                appCtx={{
                  dispatch,
                  actions,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
