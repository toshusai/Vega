import { Ref } from 'nuxt/dist/app/compat/capi'
import { IAsset } from '../core/IAsset'

interface AssetState {
  assets: IAsset[];
  selectedAssets: IAsset[];
}

const initialAssetsState: AssetState = {
  selectedAssets: [],
  assets: [
    // {
    //   id: 'asset1',
    //   type: 'Video',
    //   path: './sample_1280x720_surfing_with_audio.mp4',
    //   name: 'Big Buck Bunny'
    // },
    // {
    //   id: 'asset2',
    //   type: 'Audio',
    //   path: './tsudumi-japan.wav',
    //   name: 'Tsu-dumi Japan'
    // }
  ]
}

export function useAssets () {
  const assets = useState('assets', () => initialAssetsState)
  // const { init } = useTimeline()

  return {
    assets,

    setAssets: ((state: Ref<AssetState>) => {
      return (assets: AssetState) => {
        state.value = assets
      }
    })(assets),

    addAsset: ((state: Ref<AssetState>) => {
      return (asset: IAsset) => {
        state.value.assets = [...state.value.assets, asset]
      }
    })(assets),

    updateAsset: ((state: Ref<AssetState>) => {
      return (asset: IAsset) => {
        state.value.assets = state.value.assets.map((a) => {
          if (a.id === asset.id) {
            return asset
          }
          return a
        })
      }
    })(assets),

    removeAsset: ((state: Ref<AssetState>) => {
      return (asset: IAsset) => {
        state.value.assets = state.value.assets.filter(
          a => a.id !== asset.id
        )
      }
    })(assets)
  }
}
