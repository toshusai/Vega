import { allEase } from '@/schemas'
import { state } from '@/state'
import { selectedTextEffects } from '@/state/selectedTextEffects'
import * as RadixContextMenu from '@radix-ui/react-context-menu'
import { IconChevronRight } from '@tabler/icons-react'
import { ContextMenuItem, FloatBox, ListItem } from '@toshusai/cmpui'

export function KeyframeContextMenuContent() {
  return (
    <>
      <ContextMenuItem
        onClick={() => {
          selectedTextEffects().forEach((effect) => {
            effect.keyframes = effect.keyframes.filter(
              (keyframe) => !state.selectedKeyframeIds.includes(keyframe.id),
            )
          })
        }}
      >
        Delete
      </ContextMenuItem>
      <RadixContextMenu.Sub>
        <RadixContextMenu.SubTrigger asChild>
          <ListItem rounded size="S" className="gap-4 !pr-0">
            Ease
            <div>
              <IconChevronRight size={16} />
            </div>
          </ListItem>
        </RadixContextMenu.SubTrigger>
        <RadixContextMenu.Portal>
          <RadixContextMenu.SubContent sideOffset={2} alignOffset={-5}>
            <FloatBox>
              {allEase.map((ease) => {
                return (
                  <ContextMenuItem
                    key={ease}
                    onClick={() => {
                      selectedTextEffects().forEach((effect) => {
                        effect.keyframes.forEach((keyframe) => {
                          if (state.selectedKeyframeIds.includes(keyframe.id)) {
                            keyframe.ease = ease
                          }
                        })
                      })
                    }}
                  >
                    <div>{ease}</div>
                  </ContextMenuItem>
                )
              })}
            </FloatBox>
          </RadixContextMenu.SubContent>
        </RadixContextMenu.Portal>
      </RadixContextMenu.Sub>
    </>
  )
}
