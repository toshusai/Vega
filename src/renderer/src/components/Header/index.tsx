import { MenuBar, MenuBarButton, MenuBarItem } from '@toshusai/cmpui'
import { state } from '../../state'

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
