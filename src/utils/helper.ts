import ImageResizer from '@bam.tech/react-native-image-resizer'

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

export const objectEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key) || !objectEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

export const getResizedImage = async (uri: string, width: number, height: number) => {
  return await ImageResizer.createResizedImage(uri, width, height, 'PNG', 100, 0)
}

export const getUriToBlob = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
      resolve(xhr.response)
    }

    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'))
    }

    xhr.responseType = 'blob'

    xhr.open('GET', uri, true)
    xhr.send(null)
  })
}

export const getImageUrl = (options: {path: string; width: number}) => {
  const width = Math.round(options.width * 2)
  return `${process.env.CDN_URL}/${options.path}?w=${width}`
}
