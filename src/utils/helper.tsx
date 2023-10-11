export const setDigit = (val: string | number) => {
  const result = String(val)

  return result.length < 2 ? `0${result}` : result
}

export const getTimeOfMinute = (minute: number) => {
  return {
    hour: setDigit(Math.floor(minute / 60)),
    minute: setDigit(Math.floor(minute % 60))
  }
}

export const getDayOfWeekKey = (dayOfWeek: number) => {
  switch (dayOfWeek) {
    case 0:
      return 'sun'
    case 1:
      return 'mon'
    case 2:
      return 'tue'
    case 3:
      return 'wed'
    case 4:
      return 'thu'
    case 5:
      return 'fri'
    case 6:
      return 'sat'
    default:
      return ''
  }
}
