import { IconButton } from '@toshusai/cmpui';
import { state } from '@/state';
import { useSnapshot } from 'valtio';
import { IconMagnet } from '@tabler/icons-react';

export function ChangeKeyframeEditorSnapToggle() {
  const isSnap = useSnapshot(state).keyframeSettings.snapToKeyframe;

  return (
    <IconButton
      size="S"
      onClick={() => {
        state.keyframeSettings.snapToKeyframe = !isSnap;
      }}
      selected={isSnap}
    >
      <IconMagnet size={16} />
    </IconButton>
  );
}
