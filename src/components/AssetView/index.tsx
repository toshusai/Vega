import { useAssets } from '@/state/useAssets'
import { ListItem } from '@toshusai/cmpui'
import { Panel } from '../Panel'
import { IconTypography, IconVideo } from '@tabler/icons-react'
import { state } from '@/state'
import { useSnapshot } from 'valtio'

export function AssetView() {
  const assets = useAssets()
  const snap = useSnapshot(state)

  return (
    <Panel>
      <ul className="flex flex-col w-full overflow-y-auto">
        {assets.map((asset, index) => {
          return (
            <ListItem
              key={index}
              title={asset.name}
              className="w-full flex gap-4"
              onClick={() => {
                state.selectedAssetIds = {
                  [asset.id]: true,
                }
              }}
              selected={snap.selectedAssetIds[asset.id]}
              style={{
                fontFamily: asset.name,
              }}
            >
              <AssetTypeIcon type={asset.type} />
              {asset.name}
            </ListItem>
          )
        })}
      </ul>
    </Panel>
  )
}

function AssetTypeIcon(props: { type: string }) {
  if (props.type === 'font') return <IconTypography size={16} />
  if (props.type === 'video') return <IconVideo size={16} />
  return null
}
