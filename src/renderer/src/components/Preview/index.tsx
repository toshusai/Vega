import './index.css'

import {
  CanvasView,
  createKeyDownUpHandler,
  hsvToHex,
  RectGizmo,
  View,
  ViewMode
} from '@toshusai/cmpui'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { state } from '../Timeline'
import { isTextEffect, measureMapState, updateTextEffect } from './updateTextEffect'
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

  const measureMap = useSnapshot(measureMapState)
  const [isTextEditMode, setIsTextEditMode] = useState(false)

  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        snap.selectedStripIds.forEach((id) => {
          const strip = snap.strips.find((strip) => strip.id === id)
          if (!strip) return
          ;(strip.effects as Effect[]).forEach((effect) => {
            if (isTextEffect(effect)) {
              e.preventDefault()
              setIsTextEditMode(true)
            }
          })
        })
      }
    }

    // window.addEventListener('keydown', handleTab)
    return () => {
      window.removeEventListener('keydown', handleTab)
    }
  }, [snap.selectedStripIds, snap.strips])

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
          onPointerDown={(e) => {
            const x = (e.nativeEvent.offsetX - snap.canvasLeft) / snap.canvasScale
            const y = (e.nativeEvent.offsetY - snap.canvasTop) / snap.canvasScale
            measureMapState.forEach((value, key) => {
              if (
                value.left < x &&
                x < value.left + value.width &&
                value.top < y &&
                y < value.top + value.height
              ) {
                state.selectedStripIds = [key]
              }
            })
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
              const width = measureMap.get(strip.id)?.width ?? 0
              const height = measureMap.get(strip.id)?.height ?? 0
              const diffX =
                effect.align === undefined || effect.align === 'left'
                  ? width / 2
                  : effect.align === 'right'
                    ? -width / 2
                    : 0
              const x = (effect.x + diffX) * snap.canvasScale + snap.canvasLeft
              return (
                <Fragment key={id}>
                  {!isTextEditMode && (
                    <RectGizmo
                      angle={0}
                      height={height * snap.canvasScale}
                      width={width * snap.canvasScale}
                      nobRadius={4}
                      x={x}
                      y={(effect.y + height / 2) * snap.canvasScale + snap.canvasTop}
                      onMove={(args) => {
                        const effect = state.strips
                          .find((strip) => strip.id === id)
                          ?.effects.find((effect) => effect.id === id)
                        if (!effect) return
                        if (!isTextEffect(effect)) return
                        if (args.x && args.y) {
                          effect.x = (args.x - snap.canvasLeft) / snap.canvasScale - diffX
                          effect.y = (args.y - snap.canvasTop) / snap.canvasScale - height / 2
                        }
                      }}
                    />
                  )}
                  {isTextEditMode && (
                    <textarea
                      className="input-textarea"
                      autoFocus
                      style={{
                        position: 'absolute',
                        left: effect.x * snap.canvasScale + snap.canvasLeft,
                        top: effect.y * snap.canvasScale + snap.canvasTop,
                        width: 9999,
                        height: 9999,
                        fontSize: effect.fontSize * snap.canvasScale,
                        fontFamily: 'sans-serif',
                        color: hsvToHex(effect.color ?? { h: 0, s: 0, v: 0, a: 1 }),
                        padding: 0,
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1em',
                        background: 'transparent',
                        textAlign: effect.align
                      }}
                      onFocus={(e) => {
                        e.target.select()
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                      }}
                      onBlur={(e) => {
                        const effect = state.strips
                          .find((strip) => strip.id === id)
                          ?.effects.find((effect) => effect.id === id)
                        if (!effect) return
                        if (!isTextEffect(effect)) return
                        effect.text = e.target.value
                        setIsTextEditMode(false)
                      }}
                      defaultValue={effect.text}
                    />
                  )}
                </Fragment>
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
