import { IconButton, MenuBar, MenuBarButton, MenuBarItem, Toast } from '@toshusai/cmpui'
import { useState } from 'react'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { state } from '@/state'
import { useBackDataFromLocalStorage } from './useBackDataFromLocalStorage'

export function Header() {
  useBackDataFromLocalStorage()
  const [open, setOpen] = useState(false)
  return (
    <div className="flex justify-between">
      <MenuBar>
        <MenuBarButton
          content={
            <>
              <MenuBarItem
                onClick={() => {
                  state.recordingState = 'recording'
                }}
              >
                Export
              </MenuBarItem>
            </>
          }
        >
          File
        </MenuBarButton>
      </MenuBar>
      <IconButton
        onClick={() => {
          const json = JSON.stringify(state)
          localStorage.setItem('vega', json)
          setOpen(true)
        }}
        size="S"
      >
        <IconDeviceFloppy size={16} />
        <Toast open={open} onOpenChange={setOpen}>
          <div className="p-4">Save completed</div>
        </Toast>
      </IconButton>
    </div>
  )
}
