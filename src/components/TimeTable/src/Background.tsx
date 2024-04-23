import React from 'react'
import {G, Circle, Text} from 'react-native-svg'
import {polarToCartesian} from '../util'

interface Props {
  x: number
  y: number
  radius: number
}

interface TimePosition {
  x: number
  y: number
  hour: number
  angle: number
  dot: Boolean
}
const Background = ({x, y, radius}: Props) => {
  const [hourPositionList, setHourPositionList] = React.useState<TimePosition[]>([])

  React.useEffect(() => {
    const list = []
    for (let i = 1; i <= 24; i++) {
      const angle = i * 60 * 0.25

      const cartesian = polarToCartesian(x, y, radius + 10, angle)
      let hour = i > 12 ? i % 12 : i
      hour = hour === 0 ? 12 : hour

      const dot = hour % 6 !== 0

      list.push({...cartesian, hour, angle, dot})
    }

    setHourPositionList(list)
  }, [x, y, radius])

  return (
    <G>
      <Circle cx={x} cy={y} r={radius} fill={'#f5f6f8'} fillOpacity={1} strokeWidth={0.4} stroke={'#f5f6f8'} />
      {hourPositionList.map((hourPosition, index) => {
        return (
          <G key={index} x={hourPosition.x} y={hourPosition.y} rotation={hourPosition.angle}>
            {hourPosition.dot ? (
              <Circle r={1} fill="#7c8698" />
            ) : (
              <Text textAnchor="middle" fontSize={12} fill="#7c8698" fontFamily="Pretendard-Regular">
                {hourPosition.hour}
              </Text>
            )}
          </G>
        )
      })}
    </G>
  )
}

export default Background
