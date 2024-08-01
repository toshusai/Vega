import { CanvasView, createKeyDownUpHandler, RectGizmo, View, ViewMode } from '@toshusai/cmpui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { state } from '../Timeline'
import { isTextEffect, measureMap, updateTextEffect } from './updateTextEffect'
import { Effect, TextEffect } from '@renderer/schemas'
import { useSnapshot } from 'valtio'

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
  const snap = useSnapshot(state)

  const view = {
    x: snap.canvasLeft,
    y: snap.canvasTop,
    scale: snap.canvasScale
  }

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
    <>
      <CanvasView
        onChangeView={(view: View) => {
          state.canvasLeft = view.x
          state.canvasTop = view.y
          state.canvasScale = view.scale
        }}
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
        {snap.selectedStripIds.map((id) => {
          const strip = snap.strips.find((strip) => strip.id === id)
          if (!strip) return null
          for (const effect of strip.effects as Effect[]) {
            if (isTextEffect(effect)) {
              const width = (measureMap.get(strip.id)?.width ?? 0) * snap.canvasScale
              const height = (measureMap.get(strip.id)?.height ?? 0) * snap.canvasScale
              return (
                <RectGizmo
                  key={id}
                  angle={0}
                  height={height}
                  width={width}
                  isResizable
                  nobRadius={4}
                  x={effect.x * snap.canvasScale + snap.canvasLeft + width / 2}
                  y={effect.y * snap.canvasScale + snap.canvasTop + height / 2}
                  onMove={(args) => {
                    const effect = state.strips
                      .find((strip) => strip.id === id)
                      ?.effects.find((effect) => effect.id === id)
                    if (!effect) return
                    if (!isTextEffect(effect)) return
                    if (args.x && args.y) {
                      effect.x = (args.x - snap.canvasLeft - width / 2) / snap.canvasScale
                      effect.y = (args.y - snap.canvasTop - height / 2) / snap.canvasScale
                    }
                  }}
                />
              )
            }
          }
          return null
        })}
      </CanvasView>
    </>
  )
}

function usePointerEnterFocus() {
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.focus({
      preventScroll: true
    })
  }, [])
}
