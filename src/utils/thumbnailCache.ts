
const thumbnailCache = new Map<string, string>()

export function setCache (time: number, url: string) {
  thumbnailCache.set(time.toFixed(1), url)
}

export function getCache (time: number) {
  return thumbnailCache.get(time.toFixed(1))
}

export const drawCanvas: HTMLCanvasElement | null = document.createElement('canvas')
export const drawCtx: CanvasRenderingContext2D | null = drawCanvas?.getContext('2d')

export const thumbnailVideoMap: Map<string, HTMLVideoElement | null> = new Map()

export function getThumbnailVideo (stripId:string) {
  const video = thumbnailVideoMap.get(stripId)
  if (!video) {
    const video = document.createElement('video')
    thumbnailVideoMap.set(stripId, video)
    return video
  }
  return video
}
