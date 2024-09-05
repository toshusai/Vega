import { state } from '../../state';


export function getStripByEffectId(id: string) {
  return state.strips.find((strip) => strip.effects.some((effect) => effect.id === id));
}
