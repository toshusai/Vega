import { MenuBar, MenuBarButton, MenuBarItem } from '@toshusai/cmpui'

export function Header() {
  return (
    <MenuBar>
      <MenuBarButton
        content={
          <>
            <MenuBarItem>Export</MenuBarItem>
          </>
        }
      >
        File
      </MenuBarButton>
    </MenuBar>
  )
}
