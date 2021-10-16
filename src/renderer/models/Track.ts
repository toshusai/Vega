export interface IKeyFrame {
  start: number;
  end: number;
  prop: string;
  value: number;
}

export class KeyFrame {
  start: number;
  end: number;
  prop: string;
  value: number;

  constructor(start: number, end: number, prop: string, value: number) {
    this.start = start;
    this.end = end;
    this.prop = prop;
    this.value = value;
  }
}
