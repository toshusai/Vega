import { KeyFrame } from "./KeyFrame";

export type Effect = {
  id: string;
  type: string;
  keyframes: KeyFrame[];
};
