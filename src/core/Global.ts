export let firstInterfact = false;

export let audioCtx: AudioContext | null = null;
document.addEventListener("click", () => {
  firstInterfact = true;
  audioCtx = new AudioContext();
});
