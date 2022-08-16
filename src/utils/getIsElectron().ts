export function getIsElectron () {
  return navigator.userAgent.toLowerCase().includes(' electron/')
}
