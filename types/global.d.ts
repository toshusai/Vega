declare class CCapture {
  constructor(option: { format: "webm" });
  start(): void;
  stop(): void;
  capture(canvas: HTMLCanvasElement): void;
  save(callback: (blob: Blob) => void): void;
}
