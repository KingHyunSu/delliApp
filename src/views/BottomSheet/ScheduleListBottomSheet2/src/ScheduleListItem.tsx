import React from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import ScheduleTimeBox from './ScheduleTimeBox'
import AlarmIcon from '@/assets/icons/alarm.svg'
import {Shadow} from 'react-native-shadow-2'

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

  const activeAlarm = React.useMemo(() => {
    return item.alarm !== 0
  }, [item.alarm])

  if (isGapSchedule) {
    return (
      <Pressable style={styles.gapButton} onPress={() => openEditScheduleBottomSheet(item)}>
        <Text style={styles.gapButtonText}>일정 추가하기</Text>
      </Pressable>
    )
  }
  return (
    <View style={styles.container}>
      <ScheduleTimeBox time={item.start_time} />

      <Shadow
        style={styles.headerContainer}
        containerStyle={styles.headerWrapper}
        distance={5}
        startColor="#fff"
        // startColor="#f9f9f9"
        endColor="#fff">
        <Pressable onPress={() => onClick(item)}>
          <View style={styles.section}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <AlarmIcon width={14} height={14} fill={activeAlarm ? '#ffbf00' : '#BABABA'} />
              <Text style={{fontSize: 11}}>15분 전</Text>
            </View>

            <View style={styles.dayOfWeekContainer}>
              <Text style={[styles.dayOfWeekText, item.mon === '1' && styles.activeDayOfWeekText]}>월</Text>
              <Text style={[styles.dayOfWeekText, item.tue === '1' && styles.activeDayOfWeekText]}>화</Text>
              <Text style={[styles.dayOfWeekText, item.wed === '1' && styles.activeDayOfWeekText]}>수</Text>
              <Text style={[styles.dayOfWeekText, item.thu === '1' && styles.activeDayOfWeekText]}>목</Text>
              <Text style={[styles.dayOfWeekText, item.fri === '1' && styles.activeDayOfWeekText]}>금</Text>
              <Text style={[styles.dayOfWeekText, item.sat === '1' && styles.activeDayOfWeekText]}>토</Text>
              <Text style={[styles.dayOfWeekText, item.sun === '1' && styles.activeDayOfWeekText]}>일</Text>
            </View>

            {/* <View style={{marginLeft: 5}}>
            <AlarmIcon width={12} height={12} fill={activeAlarm ? '#ffbf00' : '#BABABA'} />
          </View> */}
          </View>

          <Text style={styles.contentText}>{item.title}</Text>

          {/* <AlarmIcon width={14} height={14} fill={activeAlarm ? '#ffbf00' : '#BABABA'} /> */}
        </Pressable>
      </Shadow>

      <View style={{gap: 15, marginBottom: 15}}>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <View style={{width: 24, height: 24, borderWidth: 1, borderColor: '#eeeded', borderRadius: 7}} />
          <Text>todo 1</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <View style={{width: 24, height: 24, borderWidth: 1, borderColor: '#eeeded', borderRadius: 7}} />
          <Text>todo 2</Text>
        </View>
      </View>
      {!isContinueSchedule && <ScheduleTimeBox time={item.end_time} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#eeeded',
    backgroundColor: '#f9f9f9'
  },
  headerWrapper: {
    marginVertical: 15
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  contentText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000'
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    gap: 3
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 11,
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

  gapButton: {
    height: 52,
    justifyContent: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#dceafe'
  },
  gapButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#1E90FF'
  }
})

export default ScheduleListItem
