import { SelectorType } from "./../store";
import { useSelector as useSelectorRR } from "react-redux";

export function useSelector<T>(f: (state: SelectorType) => T): T {
  return useSelectorRR<SelectorType, T>(f);
}
