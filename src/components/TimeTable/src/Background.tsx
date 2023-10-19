import React from 'react'
import {StyleSheet, Text} from 'react-native'
import {G, Circle, ForeignObject} from 'react-native-svg'
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
}
const Background = ({x, y, radius}: Props) => {
  const [hourPositionList, setHourPositionList] = React.useState<TimePosition[]>([])

  React.useEffect(() => {
    const list = []
    for (let i = 1; i <= 24; i++) {
      const angle = i * 60 * 0.25

      const cartesian = polarToCartesian(x, y, radius + 20, angle)
      let hour = i > 12 ? i % 12 : i
      hour = hour === 0 ? 12 : hour
      list.push({...cartesian, hour, angle})
    }

    setHourPositionList(list)
  }, [x, y, radius])

  return (
    <G>
      <Circle cx={x} cy={y} r={radius} fill={'#f5f6f8'} fillOpacity={1} />
      {hourPositionList.map((hourPosition, index) => {
        return (
          <G key={index} x={hourPosition.x} y={hourPosition.y} rotation={hourPosition.angle}>
            <ForeignObject translateX={-6}>
              <Text style={styles.text}>{hourPosition.hour}</Text>
            </ForeignObject>
          </G>
        )
      })}
    </G>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'GmarketSansTTFMedium',
    color: '#b2b2b2',
    fontSize: 12
  }
})

export default Background
