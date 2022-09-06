import { Ref } from 'nuxt/dist/app/compat/capi'
import { AssetState } from '../core'
import { IAsset } from '@/core'

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

const pluginAsset: IAsset = {
  id: 'timestamp-plugin',
  name: 'TimeStamp',
  path: '/scripts/plugins/timestamp.js',
  type: 'Plugin'
}

export function useAssets () {
  const assets = useState('assets', () => initialAssetsState)

  return {
    assets,

    setAssets: ((state: Ref<AssetState>) => {
      return (assets: AssetState) => {
        const newAssets = [systemTextAsset, pluginAsset, ...assets.assets.map(x => x)].filter((x, i, self) => self.findIndex(y => y.id === x.id) === i)
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
