import { KeyFrame } from "../effects/KeyFrame";

export function hasKeyFrame(object: any): object is { keyframes: KeyFrame[] } {
  return object.keyframes !== undefined && Array.isArray(object.keyframes);
}
