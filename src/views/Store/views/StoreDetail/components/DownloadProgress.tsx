import {useMemo} from 'react'
import {Svg, Circle, Rect} from 'react-native-svg'

interface Props {
  progress: number
}

const size = 32
const strokeWidth = 5
const DownloadProgress = ({progress}: Props) => {
  const radius = useMemo(() => {
    return (size - strokeWidth) / 2
  }, [])

  const circumference = useMemo(() => {
    return 2 * Math.PI * radius
  }, [radius])

  const progressOffset = useMemo(() => {
    return circumference - (progress / 100) * circumference
  }, [circumference, progress])

  return (
    <Svg width={size} height={size}>
      {/* Background Circle */}
      <Circle stroke="#e6e6e6" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
      {/* Progress Circle */}
      <Circle
        stroke="#1E90FF"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Pause Rect */}
      {/*<Rect x={size / 2 - size / 6} y={size / 2 - size / 6} rx={1} width={size / 3} height={size / 3} fill="#e6e6e6" />*/}
    </Svg>
  )
}

export default DownloadProgress
