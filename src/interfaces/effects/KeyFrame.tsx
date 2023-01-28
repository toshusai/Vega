import { Ease } from "@/interfaces/easing";

export type KeyFrame = {
  id: string;
  time: number;
  value: number;
  property: string;
  ease: Ease;
};
