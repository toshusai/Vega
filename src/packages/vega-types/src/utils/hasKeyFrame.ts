import { KeyFrame } from "../effects/KeyFrame";

export function hasKeyFrameProperty(object: any): object is { keyframes: KeyFrame[] } {
  return object.keyframes !== undefined && Array.isArray(object.keyframes);
}
