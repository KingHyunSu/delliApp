import {useState, useMemo, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import Svg, {G, Circle, Text} from 'react-native-svg'
import {polarToCartesian} from '@/utils/pieHelper'
import {useRecoilValue} from 'recoil'
import {activeBackgroundState} from '@/store/system'
import {colorKit} from 'reanimated-color-picker'

interface Props {
  radius: number
  percentage: number
}
interface HourRingInfo {
  x: number
  y: number
  hour: number
  angle: number
  dot: Boolean
}
const TimeBackground = ({radius, percentage}: Props) => {
  const [hourRingInfoList, setHourRingInfoList] = useState<HourRingInfo[]>([])
  const activeBackground = useRecoilValue(activeBackgroundState)

  const progressColor = useMemo(() => {
    return colorKit.brighten(activeBackground.sub_color, 10).hex()
  }, [activeBackground.sub_color])

  const hourRingColor = useMemo(() => {
    if (activeBackground.display_mode === 1) {
      return colorKit.brighten(activeBackground.sub_color, 30).hex()
    }
    return colorKit.darken(activeBackground.sub_color, 10).hex()
  }, [activeBackground.display_mode, activeBackground.sub_color])

  const strokeWidth = 20
  const size = useMemo(() => {
    return (radius + 20) * 2
  }, [radius])

  const circumference = useMemo(() => {
    return 2 * Math.PI * radius
  }, [radius])

  const progressOffset = useMemo(() => {
    return circumference - (percentage / 100) * circumference
  }, [circumference, percentage])

  useEffect(() => {
    const list = []

    for (let i = 1; i <= 24; i++) {
      const angle = i * 60 * 0.25

      const cartesian = polarToCartesian(size / 2, size / 2, radius + 10, angle)
      let hour = i > 12 ? i % 12 : i
      hour = hour === 0 ? 12 : hour

      const dot = hour % 6 !== 0

      list.push({...cartesian, hour, angle, dot})
    }

    setHourRingInfoList(list)
  }, [size, radius])

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          strokeWidth={strokeWidth}
        />

        <Circle
          fill="none"
          stroke={activeBackground.sub_color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {hourRingInfoList.map((hourRingInfo, index) => {
          return (
            <G key={index} x={hourRingInfo.x} y={hourRingInfo.y} rotation={hourRingInfo.angle}>
              <Circle r={1} fill={hourRingColor} />
              {/*{hourRingInfo.dot ? (*/}
              {/*  <Circle r={1} fill="#7c8698" />*/}
              {/*) : (*/}
              {/*  <Text textAnchor="middle" fontSize={12} fill="#7c8698" fontFamily="Pretendard-Regular" >*/}
              {/*    {hourRingInfo.hour}*/}
              {/*  </Text>*/}
              {/*)}*/}
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
