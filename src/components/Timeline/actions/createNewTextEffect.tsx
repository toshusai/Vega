import { Strip, TextEffect } from '@/schemas'
import { state } from '@/state'
import { commit } from '@/state/UndoManager'
import { getFirstAddableLayer } from '../getFirstAddableLayer'

export function createNewTextEffect() {
  const id = Math.random().toString()
  const newStrip: Strip = {
    id,
    start: state.currentTime,
    length: 1,
    layer: getFirstAddableLayer(1),
    effects: [
      {
        id,
        type: 'text',
        text: 'Text',
        fontAssetId: '',
        color: { a: 1, h: 0, s: 0, v: 0 },
        fontSize: 64,
        keyframes: [],
        x: state.canvasWidth / 2,
        y: state.canvasHeight / 2,
      } as TextEffect,
    ],
  }
  state.strips.push(newStrip)
  state.selectedStripIds = [id]
  commit()
}
