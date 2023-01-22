
export function filePick(cb: (str: string) => void) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.click();
  fileInput.onchange = () => {
    if (!fileInput.files) {
      return;
    }
    const file = fileInput.files[0];
    console.log(file);
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        cb(reader.result);
      }
    };
    reader.readAsText(file);
  };
}
