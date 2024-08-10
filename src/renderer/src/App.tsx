import '@toshusai/cmpui/dist/index.css'

import { Button, SplitPane, TooltipProvider } from '@toshusai/cmpui'
import { Panel } from './components/Panel'
import { Timeline } from './components/Timeline'
import { state } from './state'
import { Preview } from './components/Preview'
import { updateCanvas } from './rendering/updateCanvas'
import { Inspector } from './components/Inspector'
import { Header } from './components/Header'
import { proxy, useSnapshot } from 'valtio'
import { useEffect, useRef } from 'react'
import { KeyframeEditor } from './components/KeyframeEditor'

function App() {
  const snap = useSnapshot(state)
  if (snap.recordingState === 'recording') {
    return <Recorder />
  }
  return (
    <TooltipProvider>
      <div className="flex flex-col w-full gap-4">
        <Header />
        <SplitPane type="vertical" sizes={['60%', '40%']}>
          <SplitPane type="horizontal" sizes={['30%', '70%']}>
            <SplitPane type="vertical" sizes={['60%', '40%']}>
              <Panel>
                <Inspector />
              </Panel>
              <Panel>
                <KeyframeEditor />
              </Panel>
            </SplitPane>
            <Panel>
              <Preview />
            </Panel>
          </SplitPane>
          <Panel>
            <Timeline />
          </Panel>
        </SplitPane>
      </div>
    </TooltipProvider>
  )
}

export function waitAnimationFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve()
    })
  })
}

import { globalGl, glSetup } from './rendering/glSetup'
import { WebMMuxerConverter } from './encoding/WebMMuxerConverter'
import { CCaptureConverter } from './encoding/CCaptureConverter'

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
    if (!document.hidden) {
      await waitAnimationFrame()
    }
  }
  progressState.progress = 1
  converter.stop().then((url) => {
    progressState.url = url
  })
}

const progressState = proxy({
  progress: 0,
  started: false,
  url: ''
})

export function Recorder() {
  const snap = useSnapshot(state)
  const ref = useRef<HTMLCanvasElement>(null)
  const glCanvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    run(ref.current!, glCanvas.current!)
  }, [])
  const progress = useSnapshot(progressState)
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex'
      }}
    >
      <div
        style={{
          margin: 'auto',
          width: 360,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="border border-solid border-black">
          <canvas
            style={{
              width: '100%',
              display: 'none'
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
              width: '100%'
            }}
          />
          <div
            style={{
              width: `${progress.progress * 100}%`,
              height: 4,
              backgroundColor: 'black'
            }}
          ></div>
        </div>
        <div className="flex justify-between flex-col gap-4 mt-16">
          {progress.progress === 1 ? (
            <>
              <Button
                as="a"
                href={progress.url}
                download={`${new Date().toISOString().replace(/:/g, '-')}.webm`}
              >
                Download
              </Button>
              <Button
                onClick={() => {
                  state.recordingState = 'idle'
                  progressState.started = false
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button disabled>Recording...</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  state.recordingState = 'idle'
                  progressState.started = false
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
