import { Ref } from 'nuxt/dist/app/compat/capi'
import { IAsset } from '@/core/IAsset'

export interface AssetState {
  assets: IAsset[];
  selectedAssets: IAsset[];
}

const initialAssetsState: AssetState = {
  selectedAssets: [],
  assets: []
}

const systemTextAsset: IAsset = {
  id: 'system-text',
  name: 'System Text',
  path: '',
  type: 'Text'
}

export function useAssets () {
  const assets = useState('assets', () => initialAssetsState)

  return {
    assets,

    setAssets: ((state: Ref<AssetState>) => {
      return (assets: AssetState) => {
        const newAssets = [systemTextAsset, ...assets.assets.map(x => x)].filter((x, i, self) => self.findIndex(y => y.id === x.id) === i)
        state.value = {
          assets: newAssets,
          selectedAssets: assets.selectedAssets
        }
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
