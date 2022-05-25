import { Ref } from 'nuxt/dist/app/compat/capi'
import { IAsset } from '../core/IAsset'

interface AssetState {
  assets: IAsset[];
}

const initialAssetsState: AssetState = {
  assets: [
    {
      id: 'asset1',
      type: 'Video',
      path: './sample_1280x720_surfing_with_audio.mp4',
      name: 'Big Buck Bunny'
    },
    {
      id: 'asset2',
      type: 'Audio',
      path: './tsudumi-japan.mp3',
      name: 'Tsu-dumi Japan'
    }
  ]
}

export function useAssets () {
  const assets = useState('assets', () => initialAssetsState)

  return {
    assets: readonly(assets),

    setAssets: ((state: Ref<AssetState>) => {
      return (assets: AssetState) => {
        state.value = assets
      }
    })(assets)
  }
}
