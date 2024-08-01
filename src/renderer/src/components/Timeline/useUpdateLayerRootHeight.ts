import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { state } from '../../state'
import { useLayerLength } from './useLayerLength'

export function useUpdateLayerRootHeight(parent: React.MutableRefObject<HTMLDivElement | null>) {
  const snap = useSnapshot(state)
  const maxLayer = useLayerLength()
  useEffect(() => {
    if (!parent.current) return
    const parentHight = parent.current.parentElement?.clientHeight ?? 0
    const layerHeight = (maxLayer + 1) * 32 + 1 + 2 * maxLayer
    parent.current.style.height = Math.max(parentHight, layerHeight) + 'px'
  }, [maxLayer, parent, snap.strips])
}
