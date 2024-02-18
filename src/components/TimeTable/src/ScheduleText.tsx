import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
}
const ScheduleText = ({data, centerX, centerY, radius}: Props) => {
  const {top, left} = React.useMemo(() => {
    return {
      top: Math.round(centerY - (radius / 100) * data.title_y),
      left: Math.round(centerX + (radius / 100) * data.title_x)
    }
  }, [data.title_x, data.title_y, centerX, centerY, radius])

  const containerStyle = React.useMemo(() => {
    return [styles.container, {top, left, transform: [{rotateZ: `${data.title_rotate}deg`}]}]
  }, [top, left, data.title_rotate])

  const textStyle = React.useMemo(() => {
    return [styles.text, {color: data.text_color}]
  }, [data.text_color])

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{data.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: 40
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    paddingVertical: 0
  }
})

export default ScheduleText
