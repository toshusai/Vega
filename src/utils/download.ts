
export function download(blob: Blob | string, name: string) {
  const link = document.createElement("a");
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }
  if (typeof blob === "string") {
    link.href = "data:text/json;charset=utf-8," + encodeURIComponent(blob);
  } else {
    link.href = URL.createObjectURL(blob);
  }
  link.download = name;
  link.dispatchEvent(new MouseEvent("click"));
  link.remove();
}
