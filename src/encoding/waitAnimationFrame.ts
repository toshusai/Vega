export function waitAnimationFrame() {
  return new Promise<void>((resolve) => {
    let i = requestAnimationFrame(() => {
      resolve()
    })
    const change = () => {
      if (document.hidden) {
        cancelAnimationFrame(i)
        resolve()
      }
      document.removeEventListener('visibilitychange', change)
    }

    document.addEventListener('visibilitychange', change)
  })
}
