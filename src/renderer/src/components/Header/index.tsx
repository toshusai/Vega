import { MenuBar, MenuBarButton, MenuBarItem } from '@toshusai/cmpui'
import { state } from '../Timeline'

export function Header() {
  return (
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
  )
}
