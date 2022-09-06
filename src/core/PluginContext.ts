import { AssetState } from './AssetState'
import { Timeline } from './Timeline'

export interface PluginContext {
  timeline: Timeline;
  assets: AssetState
}
