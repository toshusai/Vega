import { PostProcessEffectInspector } from './PostProcessEffectInspector'
import { TextEffectInspector } from './TextEffectInspector'

export function Inspector() {
  return (
    <div className="flex p-8 w-full overflow-y-auto">
      <TextEffectInspector />
      <PostProcessEffectInspector />
    </div>
  )
}
