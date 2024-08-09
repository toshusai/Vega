import { useSnapshot } from 'valtio'
import { isPostProcessEffect } from '../../rendering/isPostProcessEffect'
import { DeepReadOnly } from '../../utils/DeepReadOnly'
import { state } from '../../state'
import { Button, TextArea } from '@toshusai/cmpui'
import { PostProcessEffect } from '@renderer/schemas'
import { useEffect, useState } from 'react'
import { materialMap } from '../../rendering/updatePostProcessEffect'
import { selectedStrips } from '../../state/selectedStrips'

export function PostProcessEffectInspector() {
  const snap = useSnapshot(state)

  const effects = snap.selectedStripIds.flatMap((id) => {
    const strip = snap.strips.find((strip) => strip.id === id)
    return strip?.effects.filter(isPostProcessEffect) ?? []
  }) as DeepReadOnly<PostProcessEffect[]>

  const [value, setValue] = useState(
    effects.every((effect) => effect.fragmentShader === effects[0].fragmentShader) &&
      effects.length > 0
      ? effects[0].fragmentShader
      : 'mixed'
  )

  useEffect(() => {
    setValue(
      effects.every((effect) => effect.fragmentShader === effects[0].fragmentShader) &&
        effects.length > 0
        ? effects[0].fragmentShader
        : 'mixed'
    )
    // fragmentShaderの更新で状態の更新を行いたくないため
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap.selectedStripIds])

  if (effects.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-8 m-8 w-full h-[512px]">
      <TextArea
        label="Text"
        className="w-full h-[256px] [&>textarea]:font-mono [&>textarea]:whitespace-nowrap"
        value={value}
        onChange={(e) => {
          const text = e.target.value
          setValue(text)
          const selectedEffects = selectedStrips().flatMap((strip) => {
            return strip.effects.filter(isPostProcessEffect)
          })

          selectedEffects.forEach((effect) => {
            effect.fragmentShader = text
          })
        }}
      />
      <Button
        onClick={() => {
          const selectedEffects = selectedStrips().flatMap((strip) => {
            return strip.effects.filter(isPostProcessEffect)
          })

          selectedEffects.forEach((effect) => {
            const mat = materialMap.get(effect.id)
            if (mat) {
              mat.fragmentShader = effect.fragmentShader
              mat.needsUpdate = true
            }
          })
        }}
      >
        Compile
      </Button>
    </div>
  )
}
