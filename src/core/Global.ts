export let firstInterfact = false;
export let audioCtx: AudioContext | null = null;

export const globalEvent = new EventTarget();

export const FIRST_INTERFACT = "firstInterfact";

export async function waitForFirstInterfact() {
  return new Promise<void>((resolve) => {
    if (firstInterfact) return resolve();
    const listener = () => {
      resolve();
      window.removeEventListener("click", listener);
    };
    window.addEventListener("click", listener);
  });
}

window.addEventListener("click", () => {
  firstInterfact = true;
  audioCtx = new AudioContext();
});
