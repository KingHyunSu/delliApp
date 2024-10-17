import React from 'react'
import {StyleSheet, View} from 'react-native'
import Svg, {G, Circle, Text} from 'react-native-svg'
import {polarToCartesian} from '@/utils/pieHelper'

interface Props {
  wrapperSize: number
  radius: number
}
interface HourRingInfo {
  x: number
  y: number
  hour: number
  angle: number
  dot: Boolean
}
const TimeBackground = ({wrapperSize, radius}: Props) => {
  const [hourRingInfoList, setHourRingInfoList] = React.useState<HourRingInfo[]>([])

  const containerStyle = React.useMemo(() => {
    return [
      styles.container,
      {
        width: wrapperSize * 2,
        height: wrapperSize * 2
      }
    ]
  }, [wrapperSize])

  React.useEffect(() => {
    const list = []

    for (let i = 1; i <= 24; i++) {
      const angle = i * 60 * 0.25

      const cartesian = polarToCartesian(wrapperSize, wrapperSize, radius + 10, angle)
      let hour = i > 12 ? i % 12 : i
      hour = hour === 0 ? 12 : hour

      const dot = hour % 6 !== 0

      list.push({...cartesian, hour, angle, dot})
    }

    setHourRingInfoList(list)
  }, [wrapperSize, radius])

  return (
    <View style={containerStyle}>
      <Svg>
        {hourRingInfoList.map((hourRingInfo, index) => {
          return (
            <G key={index} x={hourRingInfo.x} y={hourRingInfo.y} rotation={hourRingInfo.angle}>
              {hourRingInfo.dot ? (
                <Circle r={1} fill="#7c8698" />
              ) : (
                <Text textAnchor="middle" fontSize={12} fill="#7c8698" fontFamily="Pretendard-Regular">
                  {hourRingInfo.hour}
                </Text>
              )}
            </G>
          )
        })}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  }
})

export default TimeBackground
