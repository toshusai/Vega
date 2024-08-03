import { useSnapshot } from 'valtio'
import { isTextEffect, loadFont } from '../Preview/updateTextEffect'
import { state } from '../../state'
import {
  ColorInput,
  hexToHsv,
  IconButton,
  IconButtonGroup,
  Select,
  SelectItem,
  SliderNumberField,
  TextArea
} from '@toshusai/cmpui'
import { Ease, Effect, FontAsset, TextAlign, TextEffect } from '@renderer/schemas'
import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconClock } from '@tabler/icons-react'
import { useEffect } from 'react'
import { setKeyFrame } from '../KeyframeEditor'

export function Inspector() {
  return (
    <div className="flex p-8 w-full overflow-y-auto">
      <TextEffectInspector />
    </div>
  )
}

export function useSelectedStrips() {
  const snap = useSnapshot(state)
  return snap.strips.filter((strip) => snap.selectedStripIds.includes(strip.id))
}

export function selectedStrips() {
  return state.strips.filter((strip) => state.selectedStripIds.includes(strip.id))
}
export function useSelectedTextEffects() {
  const snap = useSnapshot(state)
  return snap.selectedStripIds.flatMap((id) => {
    const strip = snap.strips.find((strip) => strip.id === id)
    return strip?.effects.filter((effect) => isTextEffect(effect as Effect)) ?? []
  })
}

export function selectedTextEffects() {
  return state.selectedStripIds.flatMap((id) => {
    const strip = state.strips.find((strip) => strip.id === id)
    return strip?.effects.filter((effect) => isTextEffect(effect)) ?? []
  }) as TextEffect[]
}

function TextEffectInspector() {
  const snap = useSnapshot(state)
  const effects = snap.selectedStripIds
    .flatMap((id) => {
      const strip = snap.strips.find((strip) => strip.id === id)
      if (!strip) return []
      return strip.effects
    })
    .filter((v) => isTextEffect(v as Effect)) as TextEffect[]

  useEffect(() => {
    snap.assets.forEach((asset) => {
      if (asset.type === 'font') {
        loadFont(asset as FontAsset)
      }
    })
  }, [snap.assets])

  if (effects.length === 0) {
    return null
  }

  const mixed = effects.some((effect) => effect.text !== effects[0].text)

  return (
    <div className="flex flex-col gap-8 m-8 w-full h-[512px]">
      <TextArea
        label="Text"
        className="w-full"
        value={mixed ? '' : effects[0].text}
        onChange={(e) => {
          const text = e.target.value
          selectedTextEffects().forEach((effect) => {
            effect.text = text
          })
        }}
      />

      <div className="flex gap-8">
        <SliderNumberField
          label="X"
          value={effects.map((effect) => effect.x)}
          onChangeValue={(value) => {
            selectedTextEffects().forEach((effect, i) => {
              effect.x = value[i]
            })
          }}
        />

        <SliderNumberField
          label="Y"
          value={effects.map((effect) => effect.y)}
          onChangeValue={(value) => {
            selectedTextEffects().forEach((effect, i) => {
              effect.y = value[i]
            })
          }}
        />
        <IconButton
          onClick={() => {
            selectedStrips().forEach((strip) => {
              strip.effects
                .filter((effect) => isTextEffect(effect))
                .forEach((effect) => {
                  setKeyFrame(effect, {
                    property: 'x',
                    time: snap.currentTime - strip.start,
                    ease: Ease.Linear,
                    id: randomId(),
                    value: effect.x
                  })
                  setKeyFrame(effect, {
                    property: 'y',
                    time: snap.currentTime - strip.start,
                    ease: Ease.Linear,
                    id: randomId(),
                    value: effect.y
                  })
                })
            })
          }}
        >
          <IconClock size={16} />
        </IconButton>
      </div>

      <SliderNumberField
        label="Font Size"
        value={effects.map((effect) => effect.fontSize)}
        onChangeValue={(value) => {
          selectedTextEffects().forEach((effect, i) => {
            effect.fontSize = value[i]
          })
        }}
      />

      <ColorInput
        label="Color"
        value={effects[0].color ?? hexToHsv('#000000')}
        onChange={(value) => {
          selectedTextEffects().forEach((effect) => {
            effect.color = value
          })
        }}
      />

      <SliderNumberField
        label="characterSpacing"
        value={effects.map((effect) => effect.characterSpacing ?? 0)}
        onChangeValue={(value) => {
          selectedTextEffects().forEach((effect, i) => {
            effect.characterSpacing = value[i]
          })
        }}
      />

      <IconButtonGroup className="w-fit">
        {/* TODO: more smart way */}
        {[
          {
            align: 'left',
            icon: <IconAlignLeft size={16} />
          },
          {
            align: 'center',
            icon: <IconAlignCenter size={16} />
          },
          {
            align: 'right',
            icon: <IconAlignRight size={16} />
          }
        ].map(({ align, icon }) => (
          <IconButton
            key={align}
            selected={(effects[0].align ?? 'left') === align}
            onClick={() => {
              selectedTextEffects().forEach((effect) => {
                effect.align = align as TextAlign
              })
            }}
          >
            {icon}
          </IconButton>
        ))}
      </IconButtonGroup>

      <Select
        onChange={(value) => {
          selectedTextEffects().forEach((effect) => {
            effect.fontAssetId = value
          })
        }}
        value={effects[0].fontAssetId}
      >
        {snap.assets
          .filter((asset) => asset.type === 'font')
          .map((asset) => (
            <SelectItem key={asset.id} value={asset.id}>
              <div
                style={{
                  fontFamily: asset.name
                }}
              >
                {asset.name}
              </div>
            </SelectItem>
          ))}
      </Select>
    </div>
  )
}

function randomId(): string {
  return Math.random().toString(36).slice(-8)
}
