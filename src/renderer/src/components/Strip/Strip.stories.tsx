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

    return (
      <Strip
        left={left}
        width={width}
        onChange={(left, width) => {
          setLeft(left)
          setWidth(width)
          args.onChange(left, width)
        }}
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
    )
  }
}
