export function dateFormatter(date) {
  const result = date.toString()
  const arr = result.split('T')
  return arr[0]
}
