import { isImageEffect, isTextEffect } from "@/core";
import { SceneState } from "@/store/scene";

export function updateEffectByResolutions(
  projectData: SceneState,
  rate: number
) {
  projectData.strips.forEach((strip) => {
    strip.effects.forEach((effect) => {
      if (isTextEffect(effect)) {
        if (effect.characterSpacing) effect.characterSpacing *= rate;
        effect.fontSize *= rate;
        effect.x *= rate;
        effect.y *= rate;
        if (effect.outlineWidth) effect.outlineWidth *= rate;
        if (effect.shadowBlur) effect.shadowBlur *= rate;
      } else if (isImageEffect(effect)) {
        effect.x *= rate;
        effect.y *= rate;
        if (effect.width) effect.width *= rate;
        if (effect.height) effect.height *= rate;
      }
    });
  });
}
