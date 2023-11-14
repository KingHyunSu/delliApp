import React from 'react'
import {StyleSheet, View, TextInput} from 'react-native'

import {Schedule} from '@/types/schedule'

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

  return (
    <View style={[styles.container, {top, left, transform: [{rotateZ: `${data.title_rotate}deg`}]}]}>
      <TextInput value={data.title} style={styles.textInput} multiline editable={false} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: 40
  },
  textInput: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 14,
    color: '#000',
    paddingVertical: 0
  }
})

export default ScheduleText
