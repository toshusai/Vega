import { VNumberInput } from "@/app-ui/src";
import { TextEffect } from "@/core";

export function TextEffectView(props: { effect: TextEffect }) {
  return (
    <div>
      <div>Text</div>
      <div>
        <div>size</div>
        <VNumberInput value={props.effect.fontSize} />
      </div>
    </div>
  );
}
