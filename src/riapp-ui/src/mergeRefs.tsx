export function mergeRefs<T>(refs: React.Ref<T>[]) {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst: T) => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(inst);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T>).current = inst;
      }
    }
  };
}
