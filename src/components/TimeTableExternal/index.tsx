import React from 'react'
import {NativeModules, StyleSheet, View} from 'react-native'
import {SvgXml} from 'react-native-svg'
import Background from './src/Background'
import Schedule from './src/Schedule'
import {captureRef} from 'react-native-view-shot'

export interface TimeTableExternalRefs {
  getImage: () => Promise<string>
}
interface Options {
  width: number | string
  height: number | string
}
interface Props {
  data: Schedule[]
  options: Options
}

const TimeTableExternal = React.forwardRef<TimeTableExternalRefs, Props>(({data, options}, ref) => {
  const refs = React.useRef<View>(null)

  const width = Number(options.width)
  const height = Number(options.height)
  const center = width / 2
  const radius = (width - 16) / 2 - 10
  // const radius = center

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

  const getImage = async () => {
    if (refs.current) {
      return await captureRef(refs, {
        format: 'png',
        quality: 1
      })
    }

    return Promise.reject('TimeTableExternal image capture error!')
  }

  React.useImperativeHandle(ref, () => ({
    getImage
  }))

  const xml = `
    <svg width="${width}" height="${height}">
      ${background}
      ${schedules}
    </svg>
  `

  return (
    <View ref={refs} style={styles.container}>
      <SvgXml xml={xml} />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -1000,
    left: -1000
  }
})

export default TimeTableExternal
