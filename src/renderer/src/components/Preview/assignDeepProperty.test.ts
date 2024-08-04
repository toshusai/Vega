import { TextAlign, TextEffect } from '@renderer/schemas'
import { expect, test } from 'vitest'
import { assignDeepProperty } from './assignDeepProperty'

test('assignDeepProperty assigns a deep property to an object', () => {
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

  assignDeepProperty(textEffect, 'color.a', 0.5)

  expect(textEffect.color?.a).toBe(0.5)
})
