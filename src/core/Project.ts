import { AssetState } from './AssetState'
import { initialContaerState, initialTimelineState } from './const'
import { Container } from './Container'
import { Timeline } from './Timeline'

export interface Project {
  path: string;
  timeline: Timeline;
  assets: AssetState;
  container: Container;
}

export function getEmptyProject (): Project {
  return {
    path: '',
    timeline: {
      ...initialTimelineState
    },
    assets: {
      selectedAssets: [],
      assets: []
    },
    container: {
      ...initialContaerState
    }
  }
}
