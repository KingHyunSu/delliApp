import React from 'react'
import {G, Text} from 'react-native-svg'

const tempData = {x: 50, y: 50, rotate: 20, text: 'test123'}

interface Props {
  centerX: number
  centerY: number
  absX: number
  absY: number
}
const ScheduleText = ({centerX, centerY}: Props) => {
  const textPosition = React.useMemo(() => {
    return {
      top: centerY - tempData.y,
      left: centerX + tempData.x
    }
  }, [centerX, centerY])

  // return <Text style={[styles.text, {top: textPosition.top, left: textPosition.left, width: 40}]}>adadasdas</Text>
  return (
    <G>
      <Text fontFamily="GmarketSansTTFMedium" fontSize={14} fill="#000">
        adadasdas
      </Text>
    </G>
  )
}

export default ScheduleText
