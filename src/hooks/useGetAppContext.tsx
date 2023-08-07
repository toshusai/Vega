import { useDispatch } from "react-redux";

import { AppContext } from "@/core/types";
import { useAnimationedValue } from "@/hooks/useAnimationedValue";
import { useStripTime } from "@/hooks/useStripTime";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { readFile } from "@/ipc/readFile";
import { readFileUserDataDir } from "@/ipc/readFileUserDataDir";
import { writeFile } from "@/ipc/writeFile";
import { writeFileUserDataDir } from "@/ipc/writeFileUserDataDir";
import { actions } from "@/store/scene";


export function useGetAppContext(): AppContext {
  const dispatch = useDispatch();
  return {
    actions: actions,
    dispatch: dispatch,
    fs: {
      writeFile: writeFile,
      writeFileUserDataDir: writeFileUserDataDir,
      readFile: readFile,
      readFileUserDataDir: readFileUserDataDir,
    },
    hooks: {
      useAnimationedValue: useAnimationedValue,
      useStripTime: useStripTime,
      useUpdateEffect: useUpdateEffect,
    },
  };
}
