import '../global.css'
import '@toshusai/cmpui-css/dist/index.css'

import { userEvent } from '@vitest/browser/context'
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AssetView } from '../components/AssetView'
import { state } from '@/state'

test('select an asset', async () => {
  render(<AssetView />)
  const el = screen.getByText('Honk')
  await userEvent.click(el)
  expect(Object.keys(state.selectedAssetIds).length).toBe(1)
  expect(el).toHaveAttribute('aria-selected', 'true')
})
