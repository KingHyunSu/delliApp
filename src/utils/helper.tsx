export const setDigit = (val: string | number) => {
  const result = String(val)

  return result.length < 2 ? `0${result}` : result
}

export const getTimeOfMinute = (minute: number) => {
  const calcMinute = minute % 720
  let hour = Math.floor(calcMinute / 60)
  hour = hour === 0 ? 12 : hour

  return {
    meridiem: minute > 720 ? '오후' : '오전',
    hour: hour,
    minute: setDigit(Math.floor(calcMinute % 60))
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
