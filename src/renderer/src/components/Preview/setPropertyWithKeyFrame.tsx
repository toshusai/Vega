import { state } from '../../state';
import { Ease, Effect } from '@renderer/schemas';
import { setKeyFrame } from '../../state/setKeyFrame';
import { randomId } from '../../utils/randomId';
import { getStripByEffectId } from './getStripByEffectId';


export function setPropertyWithKeyFrame($effect: Effect, property: string, value: number) {
  const strip = getStripByEffectId($effect.id);
  if (!strip) return;
  setKeyFrame($effect, {
    property,
    value,
    time: state.currentTime - strip.start,
    ease: Ease.Linear,
    id: randomId()
  });
}
