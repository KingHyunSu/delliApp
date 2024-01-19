import React from 'react'
import {StyleSheet, View, TextInput} from 'react-native'

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

  return (
    <View style={[styles.container, {top, left, transform: [{rotateZ: `${data.title_rotate}deg`}]}]}>
      <TextInput
        value={data.title}
        style={[styles.textInput, {color: data.text_color}]}
        multiline
        scrollEnabled={false}
        editable={false}
        onPressIn={() => onClick(data)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: 40
  },
  textInput: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    paddingVertical: 0
  }
})

export default ScheduleText
