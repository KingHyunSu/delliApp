export const getRepeatTypeString = (type: number) => {
  switch (type) {
    case 1:
      return '매일'
    case 2:
      return '이틀에'
    case 3:
      return '일주일에'
    default:
      return ''
  }
}

export const getRepeatCountString = (count: number) => {
  switch (count) {
    case 1:
      return '한 번'
    case 2:
      return '두 번'
    case 3:
      return '세 번'
    case 4:
      return '네 번'
    case 5:
      return '다섯 번'
    case 6:
      return '여섯 번'
    default:
      return ''
  }
}
