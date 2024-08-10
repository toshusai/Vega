import './index.css'

import {
  CanvasView,
  hsvToHex,
  RectGizmo,
  SelectRect,
  useSelectRectHandler,
  View,
  ViewMode
} from '@toshusai/cmpui'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { state } from '../../state'
import { measureMapState } from '../../rendering/updateTextEffect'
import { isTextEffect } from '../../rendering/isTextEffect'
import { stripIsVisible } from '../../rendering/stripIsVisible'
import { pointerInRect } from '../../utils/pointerInRect'
import { Effect, Strip } from '@renderer/schemas'
import { proxy, useSnapshot } from 'valtio'
import { checkCollision } from '../../utils/checkCollision'
import { selectedTextEffects } from '../../state/selectedTextEffects'
import { useSelectedStrips } from '../../state/useSelectedStrips'
import { createPreviewDragHandler } from './createPreviewDragHandler'

import { globalGl, glSetup } from '../../rendering/glSetup'
import { updateCanvas } from '../../rendering/updateCanvas'
import { useKeyHandler } from './useKeyHandler'
import { getStripByEffectId } from './getStripByEffectId'
import { degToRad, radToDeg } from 'three/src/math/MathUtils'

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

  const glCanvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    glSetup(canvas, glCanvas.current!)

    let prevT = 0
    const render = async (t: number) => {
      if (!globalGl) return
      const dt = t - prevT
      ctx.clearRect(0, 0, width, height)
      if (state.isPlaying) {
        state.currentTime = state.currentTime + dt / 1000
      }
      globalGl.mesh.material = globalGl.mat
      globalGl.mesh.material.needsUpdate = true
      await updateCanvas(ctx)
      globalGl.mesh.material = globalGl.mat
      globalGl.mesh.material.needsUpdate = true
      globalGl.tex.needsUpdate = true
      globalGl.renderer.render(globalGl.scene, globalGl.camera)
      ctx.drawImage(globalGl.renderer.domElement, 0, 0)

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
          x: value.scaledRect.left,
          y: value.scaledRect.top,
          width: value.scaledRect.width,
          height: value.scaledRect.height
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
                background: '#fff',
                display: 'none'
              }}
            />
            <canvas
              ref={glCanvas}
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
              if (pointerInRect(x, y, value.scaledRect)) {
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
              const angle = measureMap.get(strip.id)?.angle ?? 0

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
                      height={height}
                      width={width}
                      scaleX={(effect.scale?.x ?? 1) * snap.canvasScale}
                      scaleY={(effect.scale?.y ?? 1) * snap.canvasScale}
                      origin={{
                        x: width / 2,
                        y: height / 2
                      }}
                      position={{ x, y }}
                      rootProps={{
                        className: 'gizmo-origin-override',
                        onPointerDown: (e) => {
                          const el = e.target as HTMLElement
                          if (el.parentElement?.firstChild === el) {
                            createPreviewDragHandler(strip.id)(e)
                          }
                        }
                      }}
                      setScaleX={(scaleX) => {
                        if (!isTextEffect(effect)) return
                        const $effect = selectedTextEffects().find((e) => e.id === effect.id)
                        if (!$effect) return
                        if (!$effect.scale) {
                          $effect.scale = { x: scaleX / snap.canvasScale, y: 1 }
                        } else {
                          $effect.scale.x = scaleX / snap.canvasScale
                        }
                      }}
                      setScaleY={(scaleY) => {
                        if (!isTextEffect(effect)) return
                        const $effect = selectedTextEffects().find((e) => e.id === effect.id)
                        if (!$effect) return
                        if (!$effect.scale) {
                          $effect.scale = { x: 1, y: scaleY / snap.canvasScale }
                        } else {
                          $effect.scale.y = scaleY / snap.canvasScale
                        }
                      }}
                      canResize
                      canRotate
                      angle={degToRad(angle)}
                      onChangeAngle={(angle) => {
                        if (!isTextEffect(effect)) return
                        const $effect = selectedTextEffects().find((e) => e.id === effect.id)
                        if (!$effect) return
                        $effect.angle = radToDeg(angle)
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

export function usePointerEnterFocus() {
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

export const snapState = proxy({
  points: [] as SnapPoint[]
})

type SnapPoint = {
  direction: 'horizontal' | 'vertical'
  value: number
}
