import { expect, test } from 'vitest'
import { getDeepProperty } from './getDeepProperty'
import { TextAlign, TextEffect } from '@/schemas'

test('getDeepProperty returns a deep property of an object', () => {
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

  const colorA = getDeepProperty(textEffect, 'color.a')

  expect(colorA).toBe(1)
})
