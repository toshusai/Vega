import { useSnapshot } from 'valtio';
import { state } from '../../state';


export function useTimelineSnap() {
  const snap = useSnapshot(state);
  return snap.timelineSettings?.snapToStrip;
}
