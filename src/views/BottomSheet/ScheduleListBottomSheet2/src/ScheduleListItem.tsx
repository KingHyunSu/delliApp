import React from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import AlarmIcon from '@/assets/icons/alarm.svg'

import {getTimeOfMinute} from '@/utils/helper'

import {Schedule} from '@/types/schedule'

interface Props {
  index: number
  item: Schedule
  list: Schedule[]
  onClick: (value: Schedule) => void
}
const ScheduleListItem = ({index, item, list, onClick}: Props) => {
  const isContinue = React.useMemo(() => {
    let prevScheduleIndex = index - 1

    if (prevScheduleIndex > -1) {
      const prevSchedule = list[prevScheduleIndex]

      return item.start_time === prevSchedule.end_time
    }

    return false
  }, [index, item, list])

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(item.start_time)
  }, [item.start_time])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(item.end_time)
  }, [item.end_time])

  return (
    <View style={styles.container}>
      <View style={styles.processBarContainer}>
        {!isContinue && <View style={styles.processBarCircle} />}
        <View style={styles.processBarLine} />
        <View style={styles.processBarCircle} />
      </View>

      <View style={styles.contentContainer}>
        {!isContinue && (
          <Text style={styles.timeText}>{`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분`}</Text>
        )}

        <Pressable style={styles.contentWrapper} onPress={() => onClick(item)}>
          <Text style={styles.contentText}>{item.title}</Text>

          <View style={styles.section}>
            <Text style={[styles.dayOfWeekText, item.mon === '1' && {color: '#1E90FF'}]}>월</Text>
            <Text style={[styles.dayOfWeekText, item.tue === '1' && {color: '#1E90FF'}]}>화</Text>
            <Text style={[styles.dayOfWeekText, item.wed === '1' && {color: '#1E90FF'}]}>수</Text>
            <Text style={[styles.dayOfWeekText, item.thu === '1' && {color: '#1E90FF'}]}>목</Text>
            <Text style={[styles.dayOfWeekText, item.fri === '1' && {color: '#1E90FF'}]}>금</Text>
            <Text style={[styles.dayOfWeekText, item.sat === '1' && {color: '#1E90FF'}]}>토</Text>
            <Text style={[styles.dayOfWeekText, item.sun === '1' && {color: '#1E90FF'}]}>일</Text>
          </View>

          <View style={styles.section}>
            <AlarmIcon width={16} height={16} fill={'#ffbf00'} />
            <Text style={styles.alarmText}>15분 전</Text>
          </View>
        </Pressable>

        <Text style={[styles.timeText]}>{`${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20
  },
  section: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 12,
    alignItems: 'center'
  },

  processBarContainer: {
    alignItems: 'center'
  },
  processBarCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#BABABA'
  },
  processBarLine: {
    flex: 1,
    width: 5,
    backgroundColor: '#f5f6f8'
  },

  contentContainer: {
    paddingVertical: 3,
    flex: 1
  },
  contentWrapper: {
    marginVertical: 20,
    backgroundColor: '#f6f6f6',
    padding: 20,
    borderRadius: 15
  },
  timeText: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 14
  },
  contentText: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 16
  },
  dayOfWeekWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayOfWeekText: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 12,
    color: '#c3c5cc'
  },
  alarmText: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 11,
    color: '#7c8698'
  }
})

export default ScheduleListItem
