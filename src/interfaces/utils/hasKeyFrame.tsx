import { KeyFrame } from "@/interfaces/effects/KeyFrame";

export function hasKeyFrame(object: any): object is { keyframes: KeyFrame[] } {
  return object.keyframes !== undefined && Array.isArray(object.keyframes);
}
