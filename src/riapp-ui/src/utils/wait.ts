
export async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
