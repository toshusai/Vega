import { useAssets } from '@/state/useAssets'
import { ListItem } from '@toshusai/cmpui'
import { Panel } from '../Panel'
import { IconTypography, IconVideo } from '@tabler/icons-react'

export function AssetView() {
  const assets = useAssets()

  return (
    <Panel>
      <ul className="flex flex-col w-full overflow-y-auto">
        {assets.map((asset, index) => {
          return (
            <ListItem key={index} title={asset.name} className="w-full flex gap-4">
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
