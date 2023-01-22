import { FC } from "react";
import { Effect } from "../interfaces/effects/Effect";
import { Strip } from "../interfaces/Strip";
import { isTextEffect } from "../interfaces/effects/utils/isTextEffect";
import { isVideoEffect } from "../interfaces/effects/utils/isVideoEffect";
import { isImageEffect } from "../interfaces/effects/utils/isImageEffect";
import { ImageEffectView } from "./ImageEffectView";
import { TextEffectView } from "./TextEffectView";
import { VideoEffectView } from "./VideoEffectView";

export const Effects: FC<{ effects: Effect[]; strip: Strip }> = (props) => {
  const { effects } = props;
  return (
    <div>
      {effects.map((effect) => {
        if (isTextEffect(effect)) {
          return (
            <TextEffectView
              key={effect.id}
              textEffect={effect}
              strip={props.strip}
            />
          );
        }
        if (isVideoEffect(effect)) {
          return (
            <VideoEffectView
              key={effect.id}
              videoEffect={effect}
              strip={props.strip}
            />
          );
        }
        if (isImageEffect(effect)) {
          return (
            <ImageEffectView
              key={effect.id}
              imageEffect={effect}
              strip={props.strip}
            />
          );
        }
        return null;
      })}
    </div>
  );
};
