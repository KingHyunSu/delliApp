export const getTimeString = (value: number) => {
  const hours = Math.floor(value / 60)
  const minutes = Math.floor(value % 60)
  let hoursStr = ''
  let minutesStr = ''

  if (hours > 0) {
    hoursStr = `${hours}시간 `
  }
  if (minutes > 0) {
    minutesStr = `${minutes}분`
  }

  let timeStr = `${hoursStr}${minutesStr}`
  if (hours === 0 && minutes === 0) {
    timeStr = '0분'
  }

  return timeStr
}
