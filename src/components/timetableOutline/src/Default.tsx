import {useState, useMemo, useEffect} from 'react'
import Svg, {G, Circle} from 'react-native-svg'
import {polarToCartesian} from '@/utils/pieHelper'
import {colorKit} from 'reanimated-color-picker'

interface HourRingInfo {
  x: number
  y: number
  hour: number
  angle: number
  dot: Boolean
}
interface Props {
  backgroundColor: string
  progressColor: string
  radius: number
  strokeWidth?: number
  percentage: number
}
const DefaultTimetableOutline = ({backgroundColor, progressColor, radius, strokeWidth = 20, percentage}: Props) => {
  const [hourRingInfoList, setHourRingInfoList] = useState<HourRingInfo[]>([])

  const hourRingColor = useMemo(() => {
    return colorKit.brighten(progressColor, 20).hex()
  }, [progressColor])

  const size = useMemo(() => {
    return (radius + strokeWidth) * 2
  }, [radius, strokeWidth])

  const circumference = useMemo(() => {
    return 2 * Math.PI * ((size - strokeWidth) / 2)
  }, [size, strokeWidth])

  const progressOffset = useMemo(() => {
    return circumference - (percentage / 100) * circumference
  }, [circumference, percentage])

  useEffect(() => {
    const list = []

    for (let i = 1; i <= 24; i++) {
      const angle = i * 60 * 0.25

      const cartesian = polarToCartesian(size / 2, size / 2, radius + strokeWidth / 2, angle)
      let hour = i > 12 ? i % 12 : i
      hour = hour === 0 ? 12 : hour

      const dot = hour % 6 !== 0

      list.push({...cartesian, hour, angle, dot})
    }

    setHourRingInfoList(list)
  }, [size, radius, strokeWidth])

  return (
    <Svg width={size} height={size}>
      <Circle
        stroke={backgroundColor}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={(size - strokeWidth) / 2}
        strokeWidth={strokeWidth}
      />

      <Circle
        fill="none"
        stroke={progressColor}
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
            <Circle r={strokeWidth / 20} fill={hourRingColor} />
          </G>
        )
      })}
    </Svg>
  )
}

export default DefaultTimetableOutline
