import { state } from '../state'
import { Muxer, ArrayBufferTarget } from 'webm-muxer'
import { IVegaConverter } from './IVegaConverter'

declare global {
  type AudioEncoder = {
    encode(chunk: unknown): void
    flush(): Promise<void>
    configure(config: { codec: string; sampleRate: number; numberOfChannels: number }): void
  }
}

export class WebMMuxerConverter implements IVegaConverter {
  muxer: Muxer<ArrayBufferTarget>
  videoEncoder: VideoEncoder
  audioEncoder?: AudioEncoder
  lastKeyFrame = -Infinity

  constructor() {
    this.muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'V_VP9',
        width: 1280,
        height: 720,
        frameRate: 60,
      },
      audio: {
        codec: 'A_OPUS',
        sampleRate: 44100,
        numberOfChannels: 1,
      },
      firstTimestampBehavior: 'offset',
    })

    this.videoEncoder = new VideoEncoder({
      output: (chunk, meta) => {
        this.muxer.addVideoChunk(chunk, meta)
      },
      error: console.error,
    })

    this.videoEncoder.configure({
      codec: 'vp09.00.10.08',
      width: 1280,
      height: 720,
      bitrate: 1000000,
    })
  }

  start() {
    //
  }

  capture(canvas: HTMLCanvasElement) {
    const elapsedTime = state.currentTime * 1000
    const frame = new VideoFrame(canvas, {
      timestamp: elapsedTime * 1000,
    })

    const needsKeyFrame = elapsedTime - this.lastKeyFrame >= 10000
    if (needsKeyFrame) this.lastKeyFrame = elapsedTime

    this.videoEncoder.encode(frame, { keyFrame: needsKeyFrame })
    frame.close()
  }

  async stop() {
    await this.videoEncoder?.flush()
    await this.audioEncoder?.flush()
    this.muxer.finalize()
    const { buffer } = this.muxer.target
    const url = URL.createObjectURL(new Blob([buffer], { type: 'video/webm' }))
    return url
  }
}
