import { IAsset } from '@/core/IAsset'

export interface AssetState {
  assets: IAsset[];
  selectedAssets: IAsset[];
}
