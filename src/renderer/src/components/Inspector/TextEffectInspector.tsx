import { useSnapshot } from 'valtio'
import { loadFont } from '../../rendering/updateTextEffect'
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
import { Ease, FontAsset, TextAlign } from '@renderer/schemas'
import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconClock } from '@tabler/icons-react'
import { useEffect } from 'react'
import { setKeyFrame } from '../../state/setKeyFrame'
import { getStripByEffectId } from '../Preview/getStripByEffectId'
import { randomId } from '../../utils/randomId'
import { useAnimatedEffects } from '../../state/useAnimatedEffects'
import { selectedTextEffects } from '../../state/selectedTextEffects'

export function TextEffectInspector() {
  const snap = useSnapshot(state)

  useEffect(() => {
    snap.assets.forEach((asset) => {
      if (asset.type === 'font') {
        loadFont(asset as FontAsset)
      }
    })
  }, [snap.assets])

  const effects = useAnimatedEffects()

  if (effects.length === 0) {
    return null
  }

  const setKeyFrameValue = (keyValue: Record<string, number[]>) => {
    Object.entries(keyValue).forEach(([key, value]) => {
      selectedTextEffects().forEach((effect, i) => {
        const strip = getStripByEffectId(effect.id)
        if (!strip) return
        setKeyFrame(
          effect,
          {
            property: key,
            time: state.currentTime - strip.start,
            ease: Ease.Linear,
            id: randomId(),
            value: value[i]
          },
          true
        )
      })
    })
  }

  return (
    <div className="flex flex-col gap-8 m-8 w-full h-[512px]">
      <TextArea
        label="Text"
        className="w-full"
        defaultValue={
          effects.every((effect) => effect.text === effects[0].text) ? effects[0].text : 'mixed'
        }
        onBlur={(e) => {
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
            setKeyFrameValue({
              x: value
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
            setKeyFrameValue({
              y: value
            })
          }}
        />
        <IconButton
          onClick={() => {
            setKeyFrameValue({
              x: effects.map((effect) => effect.x),
              y: effects.map((effect) => effect.y)
            })
          }}
        >
          <IconClock size={16} />
        </IconButton>
      </div>

      <div className="flex gap-4">
        <SliderNumberField
          className="w-full"
          label="Angle"
          value={effects.map((effect) => effect.angle ?? 0)}
          onChangeValue={(value) => {
            setKeyFrameValue({
              angle: value
            })
          }}
        />
        <IconButton
          onClick={() => {
            setKeyFrameValue({
              angle: effects.map((effect) => effect.angle ?? 0)
            })
          }}
        >
          <IconClock size={16} />
        </IconButton>
      </div>

      <div className="flex gap-4">
        <SliderNumberField
          className="w-full"
          label="Font Size"
          value={effects.map((effect) => effect.fontSize)}
          onChangeValue={(value) => {
            setKeyFrameValue({
              fontSize: value
            })
          }}
        />
        <IconButton
          onClick={() => {
            setKeyFrameValue({
              fontSize: effects.map((effect) => effect.fontSize)
            })
          }}
        >
          <IconClock size={16} />
        </IconButton>
      </div>

      <div className="flex gap-4">
        <ColorInput
          label="Color"
          value={
            // TODO: support mixed color
            effects[0].color
              ? {
                  h: effects[0].color.h,
                  s: effects[0].color.s,
                  v: effects[0].color.v,
                  a: effects[0].color.a
                }
              : hexToHsv('#000000')
          }
          onChange={(value) => {
            value.a = Math.max(0, Math.min(1, value.a))
            selectedTextEffects().forEach((effect) => {
              if (effect.keyframes.length === 0) {
                effect.color = value
              }
            })
            setKeyFrameValue(
              effects.reduce(
                (acc) => {
                  acc['color.h'].push(value.h)
                  acc['color.s'].push(value.s)
                  acc['color.v'].push(value.v)
                  acc['color.a'].push(value.a)
                  return acc
                },
                {
                  'color.h': [],
                  'color.s': [],
                  'color.v': [],
                  'color.a': []
                } as {
                  'color.h': number[]
                  'color.s': number[]
                  'color.v': number[]
                  'color.a': number[]
                }
              )
            )
          }}
        />
        <IconButton
          onClick={() => {
            const value = effects[0].color ?? hexToHsv('#000000')
            setKeyFrameValue(
              effects.reduce(
                (acc) => {
                  acc['color.h'].push(value.h)
                  acc['color.s'].push(value.s)
                  acc['color.v'].push(value.v)
                  acc['color.a'].push(value.a)
                  return acc
                },
                {
                  'color.h': [],
                  'color.s': [],
                  'color.v': [],
                  'color.a': []
                } as {
                  'color.h': number[]
                  'color.s': number[]
                  'color.v': number[]
                  'color.a': number[]
                }
              )
            )
          }}
        >
          <IconClock size={16} />
        </IconButton>
      </div>

      <div className="flex gap-4">
        <SliderNumberField
          className="w-full"
          label="characterSpacing"
          value={effects.map((effect) => effect.characterSpacing ?? 0)}
          onChangeValue={(value) => {
            setKeyFrameValue({
              characterSpacing: value
            })
          }}
        />
        <IconButton
          onClick={() => {
            setKeyFrameValue({
              characterSpacing: effects.map((effect) => effect.characterSpacing ?? 0)
            })
          }}
        >
          <IconClock size={16} />
        </IconButton>
      </div>

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
            selected={
              effects.every((effect) => (effect.align ?? 'left') === (align as TextAlign)) &&
              effects.length > 0
            }
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
        value={
          effects.every((effect) => effect.fontAssetId === effects[0].fontAssetId)
            ? effects[0].fontAssetId
            : '_mixed'
        }
      >
        {[
          ...snap.assets,
          {
            id: '_mixed',
            name: 'mixed',
            type: 'font'
          }
        ]
          .filter((asset) => asset.type === 'font')
          .map((asset) => (
            <SelectItem key={asset.id} value={asset.id}>
              <div
                style={{
                  fontFamily: asset.name
                }}
                className="whitespace-nowrap"
              >
                {effects.every((effect) => effect.text === effects[0].text)
                  ? effects[0].text
                  : 'mixed'}
                /{asset.name}
              </div>
            </SelectItem>
          ))}
      </Select>
    </div>
  )
}
