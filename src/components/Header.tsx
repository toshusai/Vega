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
                Export the video
              </MenuBarItem>
              <MenuBarItem
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.json'
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement
                    const file = target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        const json = e.target?.result as string
                        const obj = JSON.parse(json)
                        Object.assign(state, obj)
                      }
                      reader.readAsText(file)
                    }
                  }
                  input.click()
                  input.remove()
                }}
              >
                Open the project file
              </MenuBarItem>

              <MenuBarItem
                onClick={() => {
                  const json = JSON.stringify(state, null, 4)
                  const blob = new Blob([json], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'vega.json'
                  a.click()
                  a.remove()
                }}
              >
                Download the project file
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
