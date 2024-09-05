import { Meta, StoryObj } from '@storybook/react'
import { useEffect, useRef } from 'react'
import { loadFont, updateTextEffect } from './rendering/updateTextEffect'
import { FontAsset, Strip, TextEffect, VegaProject } from './schemas'

function TextRender(props: { effect: TextEffect }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')

    if (!ctx) {
      return
    }

    const strip: Strip = {
      effects: [props.effect],
      id: '1',
      layer: 0,
      start: 0,
      length: 1
    }
    const state: VegaProject = {
      assets: [
        {
          id: 'Honk',
          type: 'font',
          path: `https://fonts.googleapis.com/css2?family=Honk&display=swap`,
          name: 'Honk'
        }
      ],
      strips: [],
      currentTime: 0,
      fps: 60,
      initialized: false,
      isPlaying: false,
      isSnap: false,
      length: 3,
      selectedStripIds: [],
      canvasHeight: 720,
      canvasWidth: 1280,
      viewEndRate: 1,
      viewStartRate: 0,
      canvasLeft: 128,
      canvasTop: 128,
      selectedAssetIds: [],
      selectedKeyframeIds: [],
      canvasScale: 0.5,
      recordingState: 'idle'
    }
    loadFont(state.assets[0] as FontAsset).then(() => {
      updateTextEffect(ctx, strip.effects[0] as TextEffect, strip, state)
    })
  }, [props.effect])

  return (
    <canvas
      ref={ref}
      width={512}
      height={512}
      style={{
        border: '1px solid black'
      }}
    />
  )
}

const meta: Meta<typeof TextRender> = {
  component: TextRender
}

export default meta

type Story = StoryObj<typeof TextRender>

export const Default: Story = {
  args: {
    effect: {
      id: '1',
      type: 'text',
      fontAssetId: '',
      fontSize: 64,
      text: 'Text',
      x: 256,
      y: 256,
      keyframes: []
    } as TextEffect
  }
}

export const Font: Story = {
  args: {
    effect: {
      id: '1',
      type: 'text',
      fontAssetId: 'Honk',
      fontSize: 64,
      text: 'Text',
      x: 256,
      y: 256,
      keyframes: []
    } as TextEffect
  }
}

export const Multiline: Story = {
  args: {
    effect: {
      id: '1',
      type: 'text',
      fontAssetId: '',
      fontSize: 64,
      text: 'Hello\nWorld\nMultiline',
      x: 256,
      y: 256,
      keyframes: []
    } as TextEffect
  }
}

export const AlignCenter: Story = {
  args: {
    effect: {
      id: '1',
      type: 'text',
      fontAssetId: '',
      fontSize: 64,
      text: 'Hello\nWorld',
      align: 'center',
      x: 256,
      y: 256,
      keyframes: []
    } as TextEffect
  }
}

export const AlignRight: Story = {
  args: {
    effect: {
      id: '1',
      type: 'text',
      fontAssetId: '',
      fontSize: 64,
      text: 'Hello\nWorld',
      align: 'right',
      x: 256,
      y: 256,
      keyframes: []
    } as TextEffect
  }
}
