import { CanvasView, createKeyDownUpHandler, View, ViewMode } from '@toshusai/cmpui'
import { useCallback, useMemo, useRef, useState } from 'react'

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

export function Preview() {
  const [view, setView] = useState<View>({
    x: 128,
    y: 128,
    scale: 0.5
  })

  const [width, height] = [1280, 720]
  const { handleKeyDown, mode, handlePointerEnter } = useKeyHandler()
  const ref = useRef<HTMLCanvasElement>(null)
  return (
    <CanvasView
      onChangeView={setView}
      view={view}
      onKeyDown={handleKeyDown}
      mode={mode as ViewMode}
      onPointerEnter={handlePointerEnter}
      minScale={0.01}
      maxScale={16}
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
