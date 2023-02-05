import { sortStringify } from "./formatForSave";

export const jsonCompare = (a: any, b: any) => {
  return sortStringify(a, undefined) === sortStringify(b, undefined);
};
