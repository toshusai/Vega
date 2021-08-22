export function getExt(name: string) {
  const match = name.match(/\.[0-9a-z]+$/i);
  if (match) {
    return match[0];
  }
  return "";
}
