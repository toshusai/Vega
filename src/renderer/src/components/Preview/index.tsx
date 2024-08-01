import { CanvasView, createKeyDownUpHandler, View, ViewMode } from '@toshusai/cmpui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { state } from '../Timeline'
import { updateTextEffect } from './updateTextEffect'
import { TextEffect } from '@renderer/schemas'

function useKeyHandler() {
  const [keyStack, setKeyStack] = useState<string[]>([])
  const handleKeyDowns = useMemo(
    () =>
      [' ', 'Alt', 'Shift'].map((key) =>
        createKeyDownUpHandler(key, {
          onDown: (e) => {
            e.preventDefault()
            setKeyStack((keyStack) => {
              if (keyStack.includes(key)) {
                return keyStack
              }
              return [...keyStack, key]
            })
          },
          onUp: () => {
            setKeyStack((keyStack) => keyStack.filter((k) => k !== key))
          }
        })
      ),
    []
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDowns.map((handler) => handler(e))
  }

  const mode = useMemo(() => {
    if (keyStack.includes(' ')) {
      return 'pan'
    }
    if (keyStack.includes('Alt') && keyStack.includes('Shift')) {
      return 'zoom-out'
    }
    if (keyStack.includes('Alt')) {
      return 'zoom-in'
    }
    return 'default'
  }, [keyStack])

  const handlePointerEnter = usePointerEnterFocus()

  return {
    handleKeyDown,
    mode,
    handlePointerEnter
  }
}

function updateCanvas(ctx: CanvasRenderingContext2D) {
  state.strips.forEach((strip) => {
    strip.effects.forEach((effect) => {
      if (effect.type === 'text') {
        updateTextEffect(ctx, effect as TextEffect, strip, state)
      }
    })
  })
}

export function Preview() {
  const [view, setView] = useState<View>({
    x: 128,
    y: 128,
    scale: 0.5
  })

  const [width, height] = [1280, 720]
  const { handleKeyDown, mode, handlePointerEnter } = useKeyHandler()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      updateCanvas(ctx)
      requestAnimationFrame(render)
    }

    const animationId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [height, width])

  return (
    <CanvasView
      onChangeView={setView}
      view={view}
      onKeyDown={handleKeyDown}
      mode={mode as ViewMode}
      onPointerEnter={handlePointerEnter}
      minScale={0.1}
      maxScale={2}
      style={{
        background: '#ddd'
      }}
      content={
        <div
          style={
            {
              '--cmpui-block-size': `${0.5}px`
            } as React.CSSProperties
          }
        >
          <canvas
            ref={ref}
            width={width}
            height={height}
            style={{
              transformOrigin: 'top left',
              imageRendering: 'pixelated',
              background: '#fff'
            }}
          />
        </div>
      }
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            width: width * view.scale,
            height: height * view.scale,
            left: view.x,
            top: view.y
          }}
        ></div>
      </div>
    </CanvasView>
  )
}

function usePointerEnterFocus() {
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.focus({
      preventScroll: true
    })
  }, [])
}
