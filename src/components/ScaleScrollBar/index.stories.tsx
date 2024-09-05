import type { Meta, StoryObj } from '@storybook/react'

import { ScaleScrollBar } from '.'
import { useState } from 'react'

const meta: Meta<typeof ScaleScrollBar> = {
  component: ScaleScrollBar,
}

export default meta

type Story = StoryObj<typeof ScaleScrollBar>

export const Default: Story = {
  render: function Render() {
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(1)

    return (
      <div>
        <div>start: {start.toFixed(3)}</div>
        <div>end: {end.toFixed(3)}</div>

        <ScaleScrollBar
          start={start}
          end={end}
          onChange={(start, end) => {
            setStart(start)
            setEnd(end)
          }}
        />
      </div>
    )
  },
}
