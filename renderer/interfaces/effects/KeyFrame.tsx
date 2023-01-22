import { Ease } from "../../utils/easing";

export type KeyFrame = {
  id: string;
  time: number;
  value: number;
  property: string;
  ease: Ease;
};
