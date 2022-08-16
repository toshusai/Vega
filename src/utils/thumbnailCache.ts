
const thumbnailCache = new Map<string, string>()

export function setCache (time: number, url: string) {
  thumbnailCache.set(time.toFixed(1), url)
}

export function getCache (time: number) {
  return thumbnailCache.get(time.toFixed(1))
}

export let drawCanvas: HTMLCanvasElement | null = null
export let drawCtx: CanvasRenderingContext2D | null = null

export const thumbnailVideoMap: Map<string, HTMLVideoElement | null> = new Map()

export function getThumbnailVideo (stripId:string) {
  init()
  const video = thumbnailVideoMap.get(stripId)
  if (!video) {
    const video = document.createElement('video')
    thumbnailVideoMap.set(stripId, video)
    return video
  }
  return video
}

const isInited = false
function init () {
  if (!drawCanvas) {
    drawCanvas = document.createElement('canvas')
  }
  if (!drawCtx) {
    drawCtx = drawCanvas?.getContext('2d')
  }
}
