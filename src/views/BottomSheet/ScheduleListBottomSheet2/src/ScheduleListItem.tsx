import React from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import AlarmIcon from '@/assets/icons/alarm.svg'

import {getTimeOfMinute} from '@/utils/helper'

import {Schedule} from '@/types/schedule'

interface Props {
  index: number
  item: Schedule
  openEditScheduleBottomSheet: (value?: Schedule) => void
  onClick: (value: Schedule) => void
}
const ScheduleListItem = ({index, item, openEditScheduleBottomSheet, onClick}: Props) => {
  const isContinueSchedule = React.useMemo(() => {
    return item.display_type === 'continue'
  }, [item])

  const isGapSchedule = React.useMemo(() => {
    return item.display_type === 'gap'
  }, [item])

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(item.start_time)
  }, [item.start_time])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(item.end_time)
  }, [item.end_time])

  const processBarCircleColor = React.useMemo(() => {
    if (item.complete_start_time) {
      return item.background_color
    }
    return '#BABABA'
  }, [item.complete_start_time, item.background_color])

  if (isGapSchedule) {
    return (
      <View style={styles.gapContainer}>
        <View style={styles.gapLine} />
        <Pressable style={styles.gapButton} onPress={() => openEditScheduleBottomSheet(item)}>
          <Text style={styles.gapButtonText}>일정 추가하기</Text>
        </Pressable>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.processBarContainer}>
        <View style={[styles.processBarCircle, {backgroundColor: processBarCircleColor}]} />
        <View style={[styles.processBarLine, {backgroundColor: processBarCircleColor, opacity: 0.2}]} />
        {!isContinueSchedule && <View style={styles.processBarCircle} />}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.timeText}>{`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분`}</Text>

        <Pressable style={styles.contentWrapper} onPress={() => onClick(item)}>
          <Text style={styles.contentText}>{item.title}</Text>

          <View style={styles.section}>
            <Text style={[styles.dayOfWeekText, item.mon === '1' && styles.activeDayOfWeekText]}>월</Text>
            <Text style={[styles.dayOfWeekText, item.tue === '1' && styles.activeDayOfWeekText]}>화</Text>
            <Text style={[styles.dayOfWeekText, item.wed === '1' && styles.activeDayOfWeekText]}>수</Text>
            <Text style={[styles.dayOfWeekText, item.thu === '1' && styles.activeDayOfWeekText]}>목</Text>
            <Text style={[styles.dayOfWeekText, item.fri === '1' && styles.activeDayOfWeekText]}>금</Text>
            <Text style={[styles.dayOfWeekText, item.sat === '1' && styles.activeDayOfWeekText]}>토</Text>
            <Text style={[styles.dayOfWeekText, item.sun === '1' && styles.activeDayOfWeekText]}>일</Text>
          </View>

          <View style={styles.section}>
            <AlarmIcon width={16} height={16} fill={'#ffbf00'} />
            <Text style={styles.alarmText}>15분 전</Text>
          </View>
        </Pressable>

        {!isContinueSchedule && (
          <Text style={[styles.timeText]}>{`${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}</Text>
        )}
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
    marginTop: 10,
    alignItems: 'center'
  },

  processBarContainer: {
    alignItems: 'center'
  },
  processBarCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    // borderWidth: 1,
    borderColor: '#f5f6f8',
    backgroundColor: '#BABABA'
  },
  processBarLine: {
    flex: 1,
    width: 5
  },

  contentContainer: {
    paddingVertical: 3,
    flex: 1
  },
  contentWrapper: {
    marginVertical: 15,
    backgroundColor: '#f6f6f6',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15
  },
  timeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    color: '#424242'
  },
  contentText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000'
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 13,
    color: '#BABABA'
  },
  activeDayOfWeekText: {
    color: '#1A7BDB'
  },
  alarmText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#7c8698'
  },

  gapContainer: {
    position: 'relative',
    height: 52,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gapLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#f5f6f8'
  },
  gapButton: {
    width: '100%',
    position: 'absolute',
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#dceafe'
  },
  gapButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#1E90FF'
    // color: '#000080'
  }
})

export default ScheduleListItem
