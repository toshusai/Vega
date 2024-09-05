import { selectedTextEffects } from '../../state/selectedTextEffects'
import { useSelectedStrips } from '../../state/useSelectedStrips'
import { ContextMenu, ContextMenuItem, FloatBox, ListItem } from '@toshusai/cmpui'
import { state } from '@/state'
import { useSnapshot } from 'valtio'
import { Cursor } from '../Cursor'
import { KeyframeLine } from './KeyframeLine'
import { TimeView } from './TimeView'
import * as RadixContextMenu from '@radix-ui/react-context-menu'
import { IconArrowRight } from '@tabler/icons-react'
import { allEase } from '@/schemas'
import { ChangeKeyframeEditorSnapToggle } from './ChangeKeyframeEditorSnapToggle'

export function KeyframeEditor() {
  const strips = useSelectedStrips()
  const snap = useSnapshot(state)
  const pxPerSec = 100

  if (strips.length === 0) {
    return null
  }
  const strip = strips[0]

  return (
    <ContextMenu
      content={
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
              <ListItem rounded size="S">
                More Tools
                <div className="RightSlot">
                  <IconArrowRight />
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
      }
    >
      <div className="w-full">
        <div className="grid grid-cols-3 p-4">
          <div></div>
          <div className="flex justify-center"></div>
          <div className="flex justify-end">
            <ChangeKeyframeEditorSnapToggle />
          </div>
        </div>
        <div className="pl-[64px] border-b border-gray-300">
          <TimeView pxPerSec={100} startSec={0} stripStartSec={strip.start} />
        </div>
        <KeyframeLine />
        {snap.currentTime - strip.start >= 0 && (
          <Cursor
            style={{
              left: 64 + snap.currentTime * pxPerSec - strip.start * pxPerSec,
              top: 32,
            }}
          >
            {(snap.currentTime - strip.start).toFixed(2)}
          </Cursor>
        )}
      </div>
    </ContextMenu>
  )
}
