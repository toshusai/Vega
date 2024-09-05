import { state } from '@/state';
import { getSelectedAnimatedTextEffects } from '../../state/getSelectedAnimatedTextEffects';
import { selectedTextEffects } from '../../state/selectedTextEffects';
import { commit } from '@/state/UndoManager';


export function addTransformWatcher() {
  const getCurrentData = () => getSelectedAnimatedTextEffects(selectedTextEffects(), state.currentTime, state.fps);
  const serialized = JSON.stringify(getCurrentData());
  const commitHandler = () => {
    const effects = getSelectedAnimatedTextEffects(
      selectedTextEffects(),
      state.currentTime,
      state.fps
    );

    if (serialized !== JSON.stringify(effects)) {
      commit();
    }

    window.removeEventListener('pointerup', commitHandler);
  };

  window.addEventListener('pointerup', commitHandler);
}
