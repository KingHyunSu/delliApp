import React from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import ScheduleTimeBox from './ScheduleTimeBox'
import ScheduleTodoList from './ScheduleTodoList'
import AlarmIcon from '@/assets/icons/alarm.svg'

interface Props {
  item: Schedule
  index: number
  length: number
  openEditScheduleBottomSheet: (value?: Schedule) => Function
  onClick: (value: Schedule) => void
}
const ScheduleListItem = ({item, index, length, openEditScheduleBottomSheet, onClick}: Props) => {
  const isContinueSchedule = React.useMemo(() => {
    return item.display_type === 'continue'
  }, [item])

  const isGapSchedule = React.useMemo(() => {
    return item.display_type === 'gap'
  }, [item])

  const activeAlarm = React.useMemo(() => {
    return item.alarm !== 0
  }, [item.alarm])

  const getDayOfWeekTextStyle = React.useCallback((value: string) => {
    return [styles.dayOfWeekText, value === '1' && styles.activeDayOfWeekText]
  }, [])

  const handleEditScheduleBottomSheetOpen = React.useCallback(() => {
    openEditScheduleBottomSheet(item)()
  }, [openEditScheduleBottomSheet, item])

  const handleClick = React.useCallback(() => {
    onClick(item)
  }, [onClick, item])

  if (isGapSchedule) {
    return (
      <View>
        <Pressable style={styles.gapButton} onPress={handleEditScheduleBottomSheetOpen}>
          <Text style={styles.gapButtonText}>일정 추가하기</Text>
        </Pressable>
        {length - 1 === index && <ScheduleTimeBox time={item.end_time} />}
      </View>
    )
  }
  return (
    <View>
      <ScheduleTimeBox time={item.start_time} />

      <View style={styles.container}>
        <Pressable style={styles.headerContainer} onPress={handleClick}>
          <Text style={styles.contentText}>{item.title}</Text>

          <Text style={styles.dateText}>
            {`${item.start_date} ~ ${item.end_date === '9999-12-31' ? '없음' : item.end_date}`}
          </Text>

          <View style={styles.section}>
            {/* <View style={styles.alarmBox}>
              <AlarmIcon width={14} height={14} fill={activeAlarm ? '#ffbf00' : '#babfc5'} />
              <Text style={styles.alarmText}>{activeAlarm ? `${item.alarm}분 전` : '없음'}</Text>
            </View> */}

            <View style={styles.dayOfWeekContainer}>
              <Text style={getDayOfWeekTextStyle(item.mon)}>월</Text>
              <Text style={getDayOfWeekTextStyle(item.tue)}>화</Text>
              <Text style={getDayOfWeekTextStyle(item.wed)}>수</Text>
              <Text style={getDayOfWeekTextStyle(item.thu)}>목</Text>
              <Text style={getDayOfWeekTextStyle(item.fri)}>금</Text>
              <Text style={getDayOfWeekTextStyle(item.sat)}>토</Text>
              <Text style={getDayOfWeekTextStyle(item.sun)}>일</Text>
            </View>
          </View>
        </Pressable>

        {item.todo_list.length > 0 && <ScheduleTodoList data={item.todo_list} />}
      </View>

      {!isContinueSchedule && <ScheduleTimeBox time={item.end_time} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    gap: 15
  },
  headerContainer: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    gap: 10
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },

  dateText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#424242'
  },

  dayOfWeekContainer: {
    flexDirection: 'row',
    gap: 3
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 11,
    color: '#babfc5'
  },
  activeDayOfWeekText: {
    color: '#1E90FF'
  },
  alarmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  alarmText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 11,
    color: '#7c8698'
  },

  gapButton: {
    justifyContent: 'center',
    marginVertical: 15,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#1e90ff1a'
  },
  gapButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#1E90FF'
  }
})

export default ScheduleListItem
