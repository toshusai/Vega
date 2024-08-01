import type { Meta, StoryObj } from '@storybook/react'

import { Strip } from '.'
import { useState } from 'react'

const meta: Meta<typeof Strip> = {
  component: Strip
}

export default meta

type Story = StoryObj<typeof Strip>

export const Default: Story = {
  args: {
    left: 0,
    width: 100,
    onChange: (left, width) => console.log(left, width)
  },
  render: function Render(args) {
    const [left, setLeft] = useState(args.left)
    const [width, setWidth] = useState(args.width)
    const [selected, setSelected] = useState(false)

    return (
      <div
        style={{
          width: '100%',
          height: '128px',
          display: 'flex',
          border: '1px solid black',
          position: 'relative',
          overflow: 'hidden'
        }}
        onPointerDown={() => setSelected(false)}
      >
        <Strip
          top={4}
          selected={selected}
          left={left}
          width={width}
          onChange={(left, width) => {
            setLeft(left)
            setWidth(width)
            args.onChange(left, width)
          }}
          onPointerDown={() => setSelected(true)}
          onChangeEnd={args.onChange}
        >
          <div
            style={{
              padding: '0 4px'
            }}
          >
            Strip
          </div>
        </Strip>
      </div>
    )
  }
}
