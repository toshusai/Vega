export function onClickFromPointerDown(callback: () => void) {
  let isMoved = false
  const handleMove = () => {
    isMoved = true
  }

  const handleUp = () => {
    window.removeEventListener('pointerup', handleUp)
    window.removeEventListener('pointermove', handleMove)
    if (!isMoved) callback()
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}
