export interface IVegaConverter {
  start: () => void
  stop: () => Promise<string>
  capture: (canvas: HTMLCanvasElement) => void
}
