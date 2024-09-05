import { Strip } from '../schemas'
import { floorFrame } from '../utils/floorFrame'

export function stripIsVisible(strip: Strip, currentTime: number, fps: number) {
  const currentFrame = floorFrame(currentTime, fps)
  const startFrame = floorFrame(strip.start, fps)
  const endFrame = floorFrame(strip.start + strip.length, fps)
  return currentFrame >= startFrame && currentFrame < endFrame
}
