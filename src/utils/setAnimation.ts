import { Animation } from '../core/TextStripEffect'

export function setAnimation (animations: Animation[], newAnimation: Animation) {
  for (let i = 0; i < animations.length; i++) {
    // FIXME: change delta value
    if (Math.abs(animations[i].time - newAnimation.time) < 0.01 && animations[i].key === newAnimation.key) {
      animations[i] = { ...newAnimation, time: animations[i].time }
      return animations
    }
  }
  animations.push(newAnimation)
  animations.sort((a, b) => a.time - b.time)
  return animations
}
