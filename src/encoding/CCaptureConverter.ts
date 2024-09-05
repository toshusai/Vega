import { state } from '../state'
import { IVegaConverter } from './IVegaConverter'

export class CCaptureConverter implements IVegaConverter {
  ccapture: CCapture
  constructor() {
    this.ccapture = new CCapture({
      format: 'webm',
      framerate: state.fps,
      quality: 1,
    })
  }
  start() {
    this.ccapture.start()
  }
  capture(canvas: HTMLCanvasElement) {
    this.ccapture.capture(canvas)
  }
  stop() {
    this.ccapture.stop()
    const ccapture = this.ccapture

    return new Promise<string>((resolve) => {
      ccapture.save((blob) => {
        const url = URL.createObjectURL(blob)
        resolve(url)
      })
    })
  }
}
