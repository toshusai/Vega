import './index.css'

import {
  CanvasView,
  createKeyDownUpHandler,
  hsvToHex,
  RectGizmo,
  SelectRect,
  useSelectRectHandler,
  View,
  ViewMode
} from '@toshusai/cmpui'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { state } from '../../state'
import { isTextEffect, measureMapState, stripIsVisible, updateTextEffect } from './updateTextEffect'
import { Ease, Effect, Strip, TextEffect } from '@renderer/schemas'
import { proxy, useSnapshot } from 'valtio'
import { checkCollision } from '../Timeline/checkCollision'
import { setKeyFrame } from '../KeyframeEditor'
import { randomId, useSelectedStrips } from '../Inspector'
import { createPreviewDragHandler } from './createPreviewDragHandler'

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

export async function updateCanvas(ctx: CanvasRenderingContext2D) {
  for (const strip of state.strips) {
    for (const effect of strip.effects) {
      if (effect.type === 'text') {
        await updateTextEffect(ctx, effect as TextEffect, strip, state)
      }
    }
  }
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

    let prevT = 0
    const render = async (t: number) => {
      const dt = t - prevT
      ctx.clearRect(0, 0, width, height)
      if (state.isPlaying) {
        state.currentTime = state.currentTime + dt / 1000
      }
      await updateCanvas(ctx)
      prevT = t
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

  const { rect, onPointerDown } = useSelectRectHandler()

  useEffect(() => {
    if (!rect) return
    state.selectedStripIds = []
    measureMapState.forEach((value, key) => {
      const strip = getStripByEffectId(key)
      if (strip && !stripIsVisible(strip, state.currentTime, state.fps)) {
        return
      }
      if (!rect) return
      const isHit = checkCollision(
        {
          x: (rect.x - snap.canvasLeft) / snap.canvasScale,
          y: (rect.y - snap.canvasTop) / snap.canvasScale,
          width: rect.width / snap.canvasScale,
          height: rect.height / snap.canvasScale
        },
        {
          x: value.left,
          y: value.top,
          width: value.width,
          height: value.height
        }
      )
      if (isHit) {
        state.selectedStripIds.push(key)
      }
    })
  }, [rect, snap.canvasLeft, snap.canvasScale, snap.canvasTop])

  const strips = useSelectedStrips()

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
            if (mode !== 'default') return
            const x = (e.nativeEvent.offsetX - snap.canvasLeft) / snap.canvasScale
            const y = (e.nativeEvent.offsetY - snap.canvasTop) / snap.canvasScale
            let id = ''
            measureMapState.forEach((value, key) => {
              const strip = getStripByEffectId(key)
              if (strip && !stripIsVisible(strip, state.currentTime, state.fps)) {
                return
              }
              if (
                value.left < x &&
                x < value.left + value.width &&
                value.top < y &&
                y < value.top + value.height
              ) {
                if (e.metaKey) {
                  state.selectedStripIds = [...state.selectedStripIds, key]
                } else {
                  state.selectedStripIds = [key]
                }
                id = key
              }
            })
            if (!id) {
              state.selectedStripIds = []
              onPointerDown(e)
              return
            }
            const strip = getStripByEffectId(
              state.selectedStripIds[state.selectedStripIds.length - 1]
            )
            if (!strip) return
            createPreviewDragHandler(strip.id)(e)
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
        {strips.map((strip) => {
          if (!stripIsVisible(strip as Strip, snap.currentTime, snap.fps)) return null

          for (const effect of strip.effects as Effect[]) {
            if (isTextEffect(effect)) {
              const width = measureMap.get(strip.id)?.width ?? 0
              const height = measureMap.get(strip.id)?.height ?? 0

              const x =
                ((measureMap.get(strip.id)?.left ?? 0) + width / 2) * snap.canvasScale +
                snap.canvasLeft
              const y =
                ((measureMap.get(strip.id)?.top ?? 0) + height / 2) * snap.canvasScale +
                snap.canvasTop

              return (
                <Fragment key={strip.id}>
                  {!isTextEditMode && mode === 'default' && (
                    <RectGizmo
                      angle={0}
                      height={1}
                      width={1}
                      scaleX={width * snap.canvasScale}
                      scaleY={height * snap.canvasScale}
                      origin={{ x: 0.5, y: 0.5 }}
                      position={{ x, y }}
                      rootProps={{
                        className: 'gizmo-origin-override',
                        onPointerDown: createPreviewDragHandler(strip.id)
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
                          .find((_strip) => _strip.id === strip.id)
                          ?.effects.find((effect) => effect.id === strip.id)
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
        {rect && <SelectRect {...rect} />}
        <SnapHints />
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

function SnapHints() {
  const snap = useSnapshot(snapState)
  const rootSnap = useSnapshot(state)

  return (
    <div>
      {snap.points.map((point) => {
        let value = point.value * rootSnap.canvasScale
        if (point.direction === 'vertical') {
          value += rootSnap.canvasLeft
        }
        if (point.direction === 'horizontal') {
          value += rootSnap.canvasTop
        }
        return (
          <div
            key={point.direction + point.value}
            style={{
              position: 'absolute',
              left: point.direction === 'vertical' ? value : 0,
              top: point.direction === 'horizontal' ? value : 0,
              width: point.direction === 'vertical' ? 1 : '100%',
              height: point.direction === 'horizontal' ? 1 : '100%',
              background: 'red'
            }}
          ></div>
        )
      })}
    </div>
  )
}

export function getStripByEffectId(id: string) {
  return state.strips.find((strip) => strip.effects.some((effect) => effect.id === id))
}

export const snapState = proxy({
  points: [] as SnapPoint[]
})

type SnapPoint = {
  direction: 'horizontal' | 'vertical'
  value: number
}

function getNearestPoints(selfPoints: number[], targetPoints: number[], threshold: number) {
  let minPoint = Infinity
  let targetP: number | null = null
  let snapDiff = 0
  for (const selfPoint of selfPoints) {
    for (const targetPoint of targetPoints) {
      const diff = Math.abs(selfPoint - targetPoint)
      if (diff < threshold) {
        if (minPoint > diff) {
          targetP = targetPoint
          minPoint = Math.min(minPoint, Math.abs(selfPoint - targetPoint))
          snapDiff = targetPoint - selfPoint
        }
        break
      }
    }
  }

  return {
    targetP,
    snapDiff
  }
}

function getAllSnapTargetPoints(ids: string[]) {
  const targetHPoints: number[] = []
  const targetVPoints: number[] = []
  measureMapState.forEach((value, key) => {
    if (ids.includes(key)) {
      return
    }
    const sp = state.strips.find((strip) => strip.id === key)
    if (sp && !stripIsVisible(sp, state.currentTime, state.fps)) {
      return
    }
    targetHPoints.push(value.left, value.left + value.width / 2, value.left + value.width)
    targetVPoints.push(value.top, value.top + value.height / 2, value.top + value.height)
  })

  return {
    targetHPoints,
    targetVPoints
  }
}

export function snapEffect(
  newX: number,
  newY: number,
  width: number,
  height: number,
  ids: string[],
  /**
   * mutable
   */
  $effect: TextEffect,
  threshold: number
) {
  const selfHPoints = [newX, newX + width / 2, newX - width / 2]
  const selfVPoints = [newY, newY + height / 2, newY - height / 2]

  const { targetHPoints, targetVPoints } = getAllSnapTargetPoints(ids)

  snapState.points = []
  const { targetP: ph, snapDiff: diffX } = getNearestPoints(selfHPoints, targetHPoints, threshold)
  if (ph) {
    snapState.points.push({
      direction: 'vertical',
      value: ph
    })
    $effect.x = newX + diffX
  } else {
    $effect.x = newX
  }

  const { targetP: pv, snapDiff: diffY } = getNearestPoints(selfVPoints, targetVPoints, threshold)
  if (pv) {
    snapState.points.push({
      direction: 'horizontal',
      value: pv
    })
    $effect.y = newY + diffY
  } else {
    $effect.y = newY
  }

  const hasKeyframe = $effect.keyframes.length > 0
  if (hasKeyframe) {
    const strip = getStripByEffectId($effect.id)
    if (!strip) return
    const keyframe = {
      time: state.currentTime - strip.start,
      ease: Ease.Linear
    }
    setKeyFrame($effect, { ...keyframe, property: 'x', value: $effect.x, id: randomId() })
    setKeyFrame($effect, { ...keyframe, property: 'y', value: $effect.y, id: randomId() })
  }

  return {
    diffX,
    diffY
  }
}

export function setPropertyWithKeyFrame($effect: Effect, property: string, value: number) {
  const strip = getStripByEffectId($effect.id)
  if (!strip) return
  setKeyFrame($effect, {
    property,
    value,
    time: state.currentTime - strip.start,
    ease: Ease.Linear,
    id: randomId()
  })
}
