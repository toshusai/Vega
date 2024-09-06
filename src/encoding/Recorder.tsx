import { Button } from '@toshusai/cmpui'
import { state } from '../state'
import { updateCanvas } from '../rendering/updateCanvas'
import { proxy, useSnapshot } from 'valtio'
import { useRef } from 'react'
import { globalGl, glSetup } from '../rendering/glSetup'
import { WebMMuxerConverter } from './WebMMuxerConverter'
import { CCaptureConverter } from './CCaptureConverter'
import { waitAnimationFrame } from './waitAnimationFrame'

type ConverterBackend = 'webm-muxer' | 'ccapture'
const CONVERTER_BACKEND: ConverterBackend = 'webm-muxer'
const run = async (canvas: HTMLCanvasElement, glCanvas: HTMLCanvasElement) => {
  if (progressState.started) {
    return
  }
  progressState.started = true
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  progressState.progress = 0
  progressState.url = ''

  glSetup(canvas, glCanvas)

  const converter =
    CONVERTER_BACKEND === 'webm-muxer'
      ? new WebMMuxerConverter()
      : CONVERTER_BACKEND === 'ccapture'
        ? new CCaptureConverter()
        : null
  if (!converter) {
    throw new Error('Invalid converter backend')
  }

  converter.start()

  for (let index = 0; index < state.length * state.fps; index++) {
    if (state.recordingState === 'idle') {
      break
    }
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    state.currentTime = index / state.fps
    if (!globalGl) return
    globalGl.mesh.material = globalGl.mat
    globalGl.mesh.material.needsUpdate = true
    await updateCanvas(ctx)
    globalGl.mesh.material = globalGl.mat
    globalGl.mesh.material.needsUpdate = true
    globalGl.tex.needsUpdate = true
    globalGl.renderer.render(globalGl.scene, globalGl.camera)
    ctx.drawImage(globalGl.renderer.domElement, 0, 0)

    converter.capture(canvas)
    progressState.progress = index / (state.length * state.fps)
    if (index % state.fps === 0) {
      await waitAnimationFrame()
    }
  }
  converter.stop().then((url) => {
    progressState.progress = 1
    progressState.url = url
  })
}
const progressState = proxy({
  progress: 0,
  started: false,
  url: '',
})

export function Recorder() {
  const snap = useSnapshot(state)
  const ref = useRef<HTMLCanvasElement>(null)
  const glCanvas = useRef<HTMLCanvasElement>(null)

  const progress = useSnapshot(progressState)
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
      }}
    >
      <div
        style={{
          margin: 'auto',
          width: 360,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="border border-solid border-black">
          <canvas
            style={{
              width: '100%',
              display: 'none',
            }}
            ref={ref}
            id="canvas"
            width={snap.canvasWidth}
            height={snap.canvasHeight}
          ></canvas>
          <canvas
            ref={glCanvas}
            width={snap.canvasWidth}
            height={snap.canvasHeight}
            style={{
              width: '100%',
            }}
          />
          <div
            style={{
              width: `${progress.progress * 100}%`,
              height: 4,
              backgroundColor: 'black',
            }}
          ></div>
        </div>
        <div className="flex justify-end gap-4 mt-16 items-center">
          {!progress.started ? (
            <>
              <Button
                onClick={() => {
                  state.recordingState = 'idle'
                  progressState.started = false
                }}
                variant="secondary"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (!ref.current) return
                  run(ref.current, glCanvas.current!)
                }}
              >
                Start
              </Button>
            </>
          ) : progress.progress === 1 ? (
            <>
              <Button
                onClick={() => {
                  state.recordingState = 'idle'
                  progressState.started = false
                }}
                variant="secondary"
              >
                Back
              </Button>
              <Button
                as="a"
                href={progress.url}
                download={`${new Date().toISOString().replace(/:/g, '-')}.webm`}
              >
                Download
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  state.recordingState = 'idle'
                  progressState.started = false
                }}
              >
                Cancel
              </Button>
              <Button disabled>Recording...</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
