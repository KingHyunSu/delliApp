import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

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
      top: centerY - (radius / 100) * data.title_y,
      left: centerX + (radius / 100) * data.title_x
    }
  }, [data.title_x, data.title_y, centerX, centerY, radius])

  return (
    <View
      style={[
        styles.container,
        {top, left, width: data.title_width, transform: [{rotateZ: `${data.title_rotate}deg`}]}
      ]}>
      <Text style={styles.text}>{data.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: 40,
    padding: 5
  },
  text: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 14,
    color: '#000'
  }
})

export default ScheduleText
