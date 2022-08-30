import { initialTimelineState } from '@/core/const'
import { Timeline } from '@/core/Timeline'

interface AppState {
  timeline: Timeline;
}
const initialAppState: AppState = {
  timeline: initialTimelineState
}

export function useAppState () {
  const state = useState('app_state', () => initialAppState)

  return {
    timeline: readonly(state.value.timeline)
    // setTimeline: setTimeline(state.value.timeline)
  }
}
