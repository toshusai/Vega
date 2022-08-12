import { effectObjectMap } from '../composables/useTimeline'
import { AudioStripEffectObject } from './AudioStripEffectObject'
import { audioCtx } from './Global'
import { Strip } from './Strip'
import { VideoStripEffectObject } from './VideoStripEffectObject'

export class Recorder {
  data: Blob[] = []
  audioNodes: AudioNode[] = []
  audioCtx: AudioContext = new AudioContext()
  elNodeMap: WeakMap<HTMLMediaElement, AudioNode> = new WeakMap()

  recorder?: MediaRecorder
  static main?: Recorder

  stream?: MediaStream
  dst?: MediaStreamAudioDestinationNode

  onEnd?: (blob: Blob) => void

  constructor (private canvas: HTMLCanvasElement) {
    this.canvas = canvas
    Recorder.main = this
  }

  start (strips: Strip[]) {
    this.audioCtx = new AudioContext()
    const stream = this.canvas.captureStream()
    const dst = this.audioCtx.createMediaStreamDestination()

    this.recorder = new MediaRecorder(stream, {
      // mimeType: 'video/webm;codecs=vp8',
      mimeType: 'video/webm;codecs=vp9',
      audioBitsPerSecond: 16 * 1000
    })

    strips.forEach((strip) => {
      strip.effects.forEach((effect) => {
        const stripObj = effectObjectMap.get(effect.id)
        if (
          stripObj instanceof AudioStripEffectObject ||
          stripObj instanceof VideoStripEffectObject
        ) {
          let mediaEl: HTMLMediaElement | null = null
          if (stripObj instanceof AudioStripEffectObject) {
            mediaEl = stripObj.audio
          } else if (stripObj instanceof VideoStripEffectObject) {
            mediaEl = stripObj.video
          }
          if (!mediaEl) {
            return
          }
          let node = this.elNodeMap.get(mediaEl)
          if (!node) {
            node = this.audioCtx.createMediaElementSource(mediaEl)
          }
          node.connect(dst)
          this.audioNodes.push(node)
          this.elNodeMap.set(mediaEl, node)
          const ts = dst.stream.getAudioTracks()
          ts.forEach((t) => {
            stream.addTrack(t)
          })
        }
      })
    })

    this.stream = stream
    this.dst = dst

    this.recorder.ondataavailable = (ev: BlobEvent) => {
      this.data.push(ev.data)
    }

    this.recorder.addEventListener('stop', () => {
      this.onEnd?.(new Blob(this.data))
    })

    this.recorder.start()
  }

  stop () {
    this.backAudio()
    this.recorder?.stop()
    this.dst?.disconnect()
    delete this.stream
    delete this.dst
    delete this.recorder
  }

  /**
   * back audio distination to speaker.
   */
  private backAudio () {
    this.audioNodes.forEach((node) => {
      node.connect(this.audioCtx.destination)
    })
  }
}
