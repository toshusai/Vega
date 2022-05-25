import { Panel } from './Panel'
import { Rect } from './Rect'

export type Align = 'vertical' | 'horizontal' | '';

export interface Container {
  children: Container[];
  id: string;
  rect: Rect;
  panel: Panel | null;
  align: Align;
}

export type Position = 'top' | 'left' | 'right' | 'bottom';
