import { IconButton } from '@toshusai/cmpui';
import { IconMagnet } from '@tabler/icons-react';
import { state } from '../../state';
import { useTimelineSnap } from './useTimelineSnap';

export function ChangeSnapToggle() {
  const isSnap = useTimelineSnap();
  return (
    <IconButton
      size="S"
      selected={isSnap}
      onClick={() => {
        state.timelineSettings.snapToStrip = !isSnap;
      }}
    >
      <IconMagnet size={16} />
    </IconButton>
  );
}
