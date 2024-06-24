import RNFS from 'react-native-fs'
import Background from './src/Background'
import Schedule from './src/Schedule'

interface Options {
  width: number | string
  height: number | string
}
interface Props {
  data: Schedule[]
  options: Options
}

export default async ({data = [], options}: Props) => {
  if (!options.width && !options.height) {
    throw new Error('width or height undefined')
  }

  const width = Number(options.width)
  const height = Number(options.height)
  const center = width / 2
  const radius = (width - 16) / 2 - 10

  const path = RNFS.DocumentDirectoryPath + '/timetable.svg'
  console.log('path', path)

  const background = Background({center, radius})
  const schedules = data
    .map(item => {
      return Schedule({
        center,
        radius,
        data: item
      })
    })
    .join('')

  try {
    const contents: string = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          ${background}
          ${schedules}
      </svg>
    `

    await RNFS.writeFile(path, contents, 'utf8')
  } catch (e) {
    return new Error('')
  }
}
