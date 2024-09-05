import { TextAlign, TextEffect } from '@/schemas'
import { expect, test } from 'vitest'
import { getDeepProperties } from './getDeepProperties'

test('getDeepProperties returns all deep properties of an object', () => {
  const textEffect: TextEffect = {
    id: '1',
    type: 'text',
    text: 'Hello',
    x: 0,
    y: 0,
    fontSize: 20,
    align: TextAlign.left,
    characterSpacing: 0,
    color: {
      h: 0,
      s: 0,
      v: 0,
      a: 1
    },
    shadowColor: 'transparent',
    shadowBlur: 0,
    outlineColor: 'transparent',
    outlineWidth: 0,
    fontAssetId: '1',
    fontStyle: '',
    keyframes: []
  }

  const properties = getDeepProperties(textEffect)

  expect(properties).toEqual([
    'id',
    'type',
    'text',
    'x',
    'y',
    'fontSize',
    'align',
    'characterSpacing',
    'color.h',
    'color.s',
    'color.v',
    'color.a',
    'shadowColor',
    'shadowBlur',
    'outlineColor',
    'outlineWidth',
    'fontAssetId',
    'fontStyle',
    'keyframes'
  ])
})
