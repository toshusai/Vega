import { Strip } from './Strip'
import { Animation } from './TextStripEffect'

export interface Timeline {
  selectedStrips: Strip[];
  selectedKeyframes: Animation[];
  timelineTool: 'cursor' | 'cut';
  previewTool: 'cursor' | 'text';
  focusStripId: string;
  isPlay: boolean;
  curent: number;
  width: number;
  height: number;
  strips: Strip[];
  start: number;
  end: number;
  scale: number;
  length: number;
  isRecording: boolean
}
