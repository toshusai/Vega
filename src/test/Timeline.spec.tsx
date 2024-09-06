import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Timeline } from '../components/Timeline'

import '../global.css'
import '@toshusai/cmpui/dist/index.css'
import '@toshusai/cmpui-css/dist/index.css'
import { state } from '../state'

test('drag strip 30px', async () => {
  const result = render(
    <div style={{ width: '512px', display: 'flex' }}>
      <Timeline />
    </div>,
  )
  const id = state.strips[0].id
  const el = result.container.querySelector(`[data-id="${id}"]`)
  expect(el).not.toBeNull()
  const pointerId = 1
  el?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: pointerId }))
  for (let i = 1; i <= 30; i++) {
    el?.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: i, pointerId }))
  }
  el?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId }))
  const start = state.strips[0].start
  expect(start).toBe(0.3)
})
