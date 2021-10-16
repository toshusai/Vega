import { PlayMode } from "~/plugins/config";

export type IStrip = {
  id: string;
  start: number;
  length: number;
  layer: number;
  readonly type: string;
};

export class Strip implements IStrip {
  id: string = "";
  start: number = 0;
  length: number = 0;
  layer: number = 0;
  readonly type: string = "Video";

  get end() {
    return this.start + this.length;
  }

  public async update(
    _time: number,
    _delta: number,
    _isPlay: boolean,
    _playMode: PlayMode,
    _fps: number
  ) {}

  toInterface(): IStrip {
    return {
      id: this.id,
      layer: this.layer,
      length: this.length,
      start: this.start,
      type: this.type,
    };
  }
}
