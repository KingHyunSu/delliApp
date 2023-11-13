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
    console.log('scheduleText y', data.title, Math.round(centerY - (radius / 100) * data.title_y))
    console.log('scheduleText x', data.title, Math.round(centerX + (radius / 100) * data.title_x))
    return {
      top: Math.round(centerY - (radius / 100) * data.title_y),
      left: Math.round(centerX + (radius / 100) * data.title_x)
    }
  }, [data.title_x, data.title_y, centerX, centerY, radius])

  return (
    <View style={[styles.container, {top, left, transform: [{rotateZ: `${data.title_rotate}deg`}]}]}>
      <Text style={styles.text}>{data.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: 40
  },
  text: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 14,
    color: '#000'
  }
})

export default ScheduleText
