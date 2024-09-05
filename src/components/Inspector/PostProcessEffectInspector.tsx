import { useSnapshot } from 'valtio'
import { isPostProcessEffect } from '../../rendering/isPostProcessEffect'
import { DeepReadOnly } from '../../utils/DeepReadOnly'
import { state } from '../../state'
import { Button, IconButton, SliderNumberField, TextArea, TextInput } from '@toshusai/cmpui'
import { Ease, PostProcessEffect } from '@/schemas'
import { useEffect, useState } from 'react'
import { materialMap } from '../../rendering/updatePostProcessEffect'
import { selectedStrips } from '../../state/selectedStrips'
import { IconClock, IconPlus } from '@tabler/icons-react'
import { getStripByEffectId } from '../Preview/getStripByEffectId'
import { setKeyFrame } from '@/state/setKeyFrame'
import { randomId } from '@/utils/randomId'

function selectedPostEffects() {
  return selectedStrips().flatMap((strip) => {
    return strip.effects.filter(isPostProcessEffect)
  })
}

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
      : 'mixed',
  )

  useEffect(() => {
    setValue(
      effects.every((effect) => effect.fragmentShader === effects[0].fragmentShader) &&
        effects.length > 0
        ? effects[0].fragmentShader
        : 'mixed',
    )
    // fragmentShaderの更新で状態の更新を行いたくないため
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap.selectedStripIds])

  const [newUniformName, setNewUniformName] = useState('')
  if (effects.length === 0) {
    return null
  }
  if (effects.length > 1) {
    return null
  }

  const effect = effects[0]

  const setKeyFrameValue = (keyValue: Record<string, number[]>) => {
    Object.entries(keyValue).forEach(([key, value]) => {
      selectedPostEffects().forEach((effect, i) => {
        const strip = getStripByEffectId(effect.id)
        if (!strip) return
        setKeyFrame(
          effect,
          {
            property: key,
            time: state.currentTime - strip.start,
            ease: Ease.Linear,
            id: randomId(),
            value: value[i],
          },
          true,
        )
      })
    })
  }

  return (
    <div className="flex flex-col gap-16 m-8 w-full h-[512px]">
      <Button
        size="S"
        variant="secondary"
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
      <TextArea
        label="Text"
        className="w-full h-[128px] [&>textarea]:font-mono [&>textarea]:whitespace-nowrap [&>textarea]:text-[10px]"
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

      {Object.entries(effect.uniforms ?? {}).map(([key, value]) => {
        return (
          <div className="flex gap-4" key={key}>
            <SliderNumberField
              label={key}
              value={[value]}
              onChangeValue={(value) => {
                selectedStrips().forEach((strip) => {
                  strip.effects.forEach((effect) => {
                    if (isPostProcessEffect(effect)) {
                      if (!effect.uniforms) {
                        effect.uniforms = {}
                      }
                      effect.uniforms[key] = value[0]
                    }
                  })
                })
              }}
            />
            <IconButton
              onClick={() => {
                setKeyFrameValue({
                  ['uniforms.' + key]: [value],
                })
              }}
            >
              <IconClock size={16} />
            </IconButton>
          </div>
        )
      })}

      <div className="flex gap-4">
        <TextInput
          label="Uniform Name"
          className="w-full"
          value={newUniformName}
          onChange={(e) => {
            setNewUniformName(e.target.value)
          }}
        />
        <IconButton
          onClick={() => {
            selectedStrips().forEach((strip) => {
              strip.effects.forEach((effect) => {
                if (isPostProcessEffect(effect)) {
                  if (!effect.uniforms) {
                    effect.uniforms = {}
                  }
                  effect.uniforms[newUniformName] = 0
                }
              })
            })
          }}
        >
          <IconPlus size={16} />
        </IconButton>
      </div>
    </div>
  )
}
