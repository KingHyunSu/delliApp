import React from 'react'
import {StyleSheet, Pressable, TextInput} from 'react-native'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
  onClick?: (value: Schedule) => void
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
    return [styles.text, {color: data.text_color, fontSize: data.font_size}]
  }, [data.text_color, data.font_size])

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(data)
    }
  }, [onClick, data])

  return (
    <Pressable style={containerStyle} onPress={handleClick}>
      <TextInput value={data.title} style={textStyle} readOnly multiline scrollEnabled={false} onPress={handleClick} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    minWidth: 150,
    minHeight: 28,
    paddingTop: 0
  }
})

export default ScheduleText
