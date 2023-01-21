import { FC } from "react";
import { Effect } from "../interfaces/Effect";
import { Strip } from "../interfaces/Strip";
import { isTextEffect } from "../interfaces/TextEffect";
import { isVideoEffect } from "../interfaces/VideoEffect";
import { TextEffectView } from "./TextEffectView";
import { VideoEffectView } from "./VideoEffectView";

export const Effects: FC<{ effects: Effect[]; strip: Strip; }> = (props) => {
    const { effects } = props;
    return (
        <div>
            {effects.map((effect) => {
                if (isTextEffect(effect)) {
                    return (
                        <TextEffectView
                            key={effect.id}
                            textEffect={effect}
                            strip={props.strip} />
                    );
                }
                if (isVideoEffect(effect)) {
                    return (
                        <VideoEffectView
                            key={effect.id}
                            videoEffect={effect}
                            strip={props.strip} />
                    );
                }
            })}
        </div>
    );
};
