export const setDigit = (val: string | number) => {
  const result = String(val)

  return result.length < 2 ? `0${result}` : result
}

export const getTimeOfMinute = (minute: number) => {
  const calcMinute = minute % 720
  let hour = Math.floor(calcMinute / 60)
  hour = hour === 0 ? 12 : hour

  return {
    meridiem: minute >= 720 ? '오후' : '오전',
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

export const getFocusTimeText = (seconds: number) => {
  const hours = Math.floor(seconds / 3600) // 전체 초에서 시간을 계산
  const minutes = Math.floor((seconds % 3600) / 60) // 남은 초에서 분을 계산
  const secs = seconds % 60 // 남은 초

  const hoursStr = hours === 0 ? '' : String(hours).padStart(2, '0') + ':'
  return `${hoursStr}${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
