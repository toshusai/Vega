export function timeFormat (time: number) {
  let s = time
  if (s < 0) {
    s = -s
  }
  const sec = s.toFixed(3)
  const ms = sec.split('.')[1]
  const hhmmss = new Date(s * 1000).toISOString().substr(11, 8)
  let sign = ''
  if (s < 0) { sign = '-' }
  return `${sign}${hhmmss}.${ms}`
}
