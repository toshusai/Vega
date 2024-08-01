import { TextEffect, VegaProject } from '@renderer/schemas'
import { proxy } from 'valtio'

export const state = proxy({
  assets: [],
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
  recordingState: 'idle',
  strips: [
    {
      effects: [
        {
          id: '1',
          type: 'text',
          fontAssetId: 'Arial',
          fontSize: 64,
          text: 'Hello',
          x: 0,
          y: 0,
          keyframes: []
        } as TextEffect
      ],
      id: '1',
      layer: 0,
      start: 0,
      length: 1
    },
    {
      effects: [
        {
          id: '2',
          type: 'text',
          fontAssetId: 'Arial',
          fontSize: 64,
          text: 'World',
          x: 100,
          y: 300,
          keyframes: []
        } as TextEffect
      ],
      id: '2',
      layer: 1,
      start: 0.8,
      length: 1.3
    },
    {
      effects: [
        {
          id: '3',
          type: 'text',
          fontAssetId: 'Arial',
          fontSize: 64,
          text: 'Text\nEffect',
          x: 300,
          y: 200,
          keyframes: []
        } as TextEffect
      ],
      id: '3',
      layer: 0,
      start: 1.4,
      length: 1.1
    }
  ]
} as VegaProject)
