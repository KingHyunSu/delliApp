import React from 'react'
import {StyleSheet, Pressable, Text} from 'react-native'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
  onClick: (value: Schedule) => void
}
const ScheduleText = ({data, centerX, centerY, radius, onClick}: Props) => {
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

  const handleClick = React.useCallback(() => {
    onClick(data)
  }, [onClick, data])

  return (
    <Pressable style={containerStyle} onPress={handleClick}>
      <Text style={textStyle}>{data.title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
    // minWidth: 40
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    paddingVertical: 0,
    minWidth: 150,
    minHeight: 28
  }
})

export default ScheduleText
