import './tailwind.css'
import '@toshusai/cmpui/dist/index.css'

import { Button, SplitPane } from '@toshusai/cmpui'
import { Panel } from './components/Panel'
import { state, Timeline } from './components/Timeline'
import { Preview, updateCanvas } from './components/Preview'
import { Inspector } from './components/Inspector'
import { Header } from './components/Header'
import { useSnapshot } from 'valtio'
import { useEffect, useRef } from 'react'

function App() {
  const snap = useSnapshot(state)
  if (snap.recordingState === 'recording') {
    return <Recorder />
  }
  return (
    <div className="flex flex-col w-full">
      <Header />
      <SplitPane type="vertical" sizes={['60%', '40%']}>
        <SplitPane type="horizontal" sizes={['30%', '70%']}>
          <Panel>
            <Inspector />
          </Panel>
          <Panel>
            <Preview />
          </Panel>
        </SplitPane>
        <Panel>
          <Timeline />
        </Panel>
      </SplitPane>
    </div>
  )
}

let once = false
export function Recorder() {
  const snap = useSnapshot(state)
  const ref = useRef<HTMLCanvasElement>(null)
  const run = async () => {
    if (once) {
      return
    }
    const ctx = ref.current?.getContext('2d')
    if (!ctx) {
      return
    }
    once = true
    const capture = new CCapture({
      format: 'webm',
      framerate: snap.fps,
      quality: 1
    })
    capture.start()
    for (let index = 0; index < snap.length * snap.fps; index++) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      state.currentTime = index / snap.fps
      updateCanvas(ctx)
      capture.capture(ctx.canvas)
    }
    capture.stop()
    capture.save((blob) => {
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'recording.webm'
      a.click()
    })
  }

  useEffect(() => {
    setTimeout(() => {
      run()
    }, 100)
  }, [])
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex'
      }}
    >
      <canvas
        style={{
          position: 'absolute',
          display: 'none'
        }}
        ref={ref}
        id="canvas"
        width={snap.canvasWidth}
        height={snap.canvasHeight}
      ></canvas>
      <div
        style={{
          margin: 'auto'
        }}
      >
        <Button
          onClick={() => {
            state.recordingState = 'idle'
          }}
        >
          Stop Recording
        </Button>
      </div>
    </div>
  )
}

export default App
