import { useSnapshot } from 'valtio'
import { isTextEffect } from '../Preview/updateTextEffect'
import { state } from '../Timeline'
import {
  ColorInput,
  hexToHsv,
  Select,
  SelectItem,
  SliderNumberField,
  TextArea
} from '@toshusai/cmpui'
import { Effect, TextAlign, TextEffect } from '@renderer/schemas'

export function Inspector() {
  return (
    <div className="flex m-8 w-full">
      <TextEffectInspector />
    </div>
  )
}

function selectedTextEffects() {
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
  if (effects.length === 0) {
    return null
  }

  const mixed = effects.some((effect) => effect.text !== effects[0].text)

  return (
    <div className="flex flex-col gap-8 m-8 w-full">
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

      <Select
        label="Align"
        value={effects[0].align ?? 'left'}
        onChange={(value) => {
          selectedTextEffects().forEach((effect) => {
            effect.align = value as TextAlign
          })
        }}
      >
        <SelectItem value="left">Left</SelectItem>
        <SelectItem value="center">Center</SelectItem>
        <SelectItem value="right">Right</SelectItem>
      </Select>
    </div>
  )
}
