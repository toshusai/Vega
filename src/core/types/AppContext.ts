import { UseAnimationedValue, UseStripTime, UseUpdateEffect } from "./hooks";

export interface AppContext {
  dispatch: any;
  actions: any;
  fs: {
    writeFile: (path: string, data: any) => Promise<any>;
  };
  hooks: {
    useUpdateEffect: UseUpdateEffect;
    useStripTime: UseStripTime;
    useAnimationedValue: UseAnimationedValue;
  };
}
