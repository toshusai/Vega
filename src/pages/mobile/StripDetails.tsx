import { isTextEffect } from "@/core";
import { useSelector } from "@/hooks/useSelector";

import { TextEffectView } from "./TextEffectView";


export function StripDetails() {
  const strip = useSelector((state) => state.scene.strips.find((s) => s.id === state.scene.selectedStripIds[0])
  );
  if (!strip) return null;
  return (
    <div>
      <div>
        <div>
          <div>start</div>
          <div>{strip.start}</div>
        </div>
        <div>
          <div>length</div>
          <div>{strip.length}</div>
        </div>
      </div>
      {strip.effects.map((e) => {
        if (isTextEffect(e)) {
          return <TextEffectView key={e.id} effect={e} />;
        }
        return null;
      })}
    </div>
  );
}
