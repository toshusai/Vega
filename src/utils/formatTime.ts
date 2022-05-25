export function timeFormat (time: number) {
  let s = time
  if (s < 0) {
    s = -s
  }
  const sec = s.toFixed(4)
  const ms = sec.substr(sec.length - 4, 4)
  const hhmmss = new Date(s * 1000).toISOString().substr(11, 8)
  let sign = ''
  if (s < 0) { sign = '-' }
  return `${sign}${hhmmss}.${ms}`
}
