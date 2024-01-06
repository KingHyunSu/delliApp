import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {getTimeOfMinute} from '@/utils/helper'

interface Props {
  time: number
}
const ScheduleTimeBox = ({time}: Props) => {
  const timeInfo = React.useMemo(() => {
    return getTimeOfMinute(time)
  }, [time])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`}</Text>
      <View style={styles.line} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#424242'
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#eeeded'
  }
})

export default ScheduleTimeBox
