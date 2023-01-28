import { FC } from "react";
import { Effect , Strip } from "@/packages/types";
import { isTextEffect } from "../../interfaces/effects/utils/isTextEffect";
import { isVideoEffect } from "../../interfaces/effects/utils/isVideoEffect";
import { isImageEffect } from "../../interfaces/effects/utils/isImageEffect";
import { ImageEffectView } from "./ImageEffectView";
import { TextEffectView } from "./TextEffectView";
import { VideoEffectView } from "./VideoEffectView";
import { isAudioEffect } from "@/interfaces/effects/utils/isAudioEffect";
import { AudioEffectView } from "./AudioEffectView";
import { isScriptEffect } from "@/interfaces/effects/ScriptEffect";
import { ScriptEffectView } from "./ScriptEffectView";
import { useDispatch } from "react-redux";
import { actions } from "@/store/scene";

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
