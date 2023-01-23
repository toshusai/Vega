import { SceneState } from "../store/scene";

export function formatForSave(data: SceneState) {
  const json = JSON.stringify(
    data,
    (_, value) => {
      if (Array.isArray(value) && value instanceof Array) {
        return [...value].sort();
      }
      if (value instanceof Object) {
        const ordered: { [key: string]: any } = {};
        Object.keys(value)
          .sort()
          .forEach((key) => {
            ordered[key] = value[key];
          });

        return ordered;
      }

      return value;
    },
    2
  );
  return json;
}
