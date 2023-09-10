export const setDigit = (val: string | number) => {
  const result = String(val)

  return result.length < 2 ? `0${result}` : result
}

export const getTimeOfMinute = (minute: number) => {
  return {
    hour: Math.floor(minute / 60),
    minute: setDigit(Math.floor(minute % 60))
  }
}
