import { UseAnimationedValue, UseStripTime, UseUpdateEffect } from "./hooks";

export interface AppContext {
  dispatch: any;
  actions: any;
  fs: {
    writeFile: (path: string, data: any) => Promise<any>;
    readFile: (path: string) => Promise<any>;
    writeFileUserDataDir: (path: string, data: any) => Promise<any>;
    readFileUserDataDir: (path: string) => string | false;
  };
  hooks: {
    useUpdateEffect: UseUpdateEffect;
    useStripTime: UseStripTime;
    useAnimationedValue: UseAnimationedValue;
  };
}
