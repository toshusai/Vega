import { isElectron } from "@/ipc/readFileUserDataDir";

export function filePick(
  cb: (str: string, path: string, name: string) => void,
  accept = ".json"
) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = accept;
  fileInput.click();
  fileInput.onchange = () => {
    if (!fileInput.files) {
      return;
    }
    const file = fileInput.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (isElectron()) {
          cb(reader.result, file.path, file.name);
        } else {
          const path = URL.createObjectURL(file);
          cb(reader.result, path, file.name);
        }
      }
    };
    reader.readAsText(file);
  };
}
