import React from 'react'
import {StyleSheet, Pressable, View, Text, Image} from 'react-native'
import TodoList from './src/TodoList'

import {useRecoilValue} from 'recoil'
import {focusModeInfoState, scheduleCategoryListState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import RepeatIcon from '@/assets/icons/repeat.svg'

interface Props {
  item: Schedule
  onClick?: (value: Schedule) => void
}
const ScheduleItem = ({item, onClick}: Props) => {
  const focusModeInfo = useRecoilValue(focusModeInfoState)
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)

  const getDayOfWeekTextStyle = React.useCallback((value: string) => {
    return [styles.dayOfWeekText, value === '1' && styles.activeDayOfWeekText]
  }, [])

  const isComplete = React.useMemo(() => {
    return !!(item.complete_state && item.complete_state > 0)
  }, [item.complete_state])

  const isFocusMode = React.useMemo(() => {
    return focusModeInfo?.schedule_id === item.schedule_id
  }, [item.schedule_id, focusModeInfo?.schedule_id])

  const scheduleCategoryTitle = React.useMemo(() => {
    const target = scheduleCategoryList.find(scheduleCategory => {
      return scheduleCategory.schedule_category_id === item.schedule_category_id
    })

    return target ? target.title : '미지정'
  }, [scheduleCategoryList, item.schedule_category_id])

  const getTimeText = (time: number) => {
    const timeInfo = getTimeOfMinute(time)

    return `${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`
  }

  const handleClick = React.useCallback(() => {
    if (!onClick) {
      return
    }

    onClick(item)
  }, [onClick, item])

  const getFocusTime = React.useCallback(
    (seconds: number) => {
      const hours = Math.floor(seconds / 3600) // 전체 초에서 시간을 계산
      const minutes = Math.floor((seconds % 3600) / 60) // 남은 초에서 분을 계산
      const secs = seconds % 60 // 남은 초

      const hoursStr = hours === 0 ? '' : String(hours).padStart(2, '0') + ':'
      return `${hoursStr}${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },
    [focusModeInfo]
  )

  const focusTimeTextComponent = React.useMemo(() => {
    let focusTimeText = ''

    if (isFocusMode && focusModeInfo) {
      focusTimeText = getFocusTime(focusModeInfo.seconds)
    } else if (item.active_time) {
      focusTimeText = getFocusTime(item.active_time)
    }

    if (focusTimeText) {
      const color = isFocusMode ? '#FF0000' : '#1E90FF'
      return <Text style={[styles.focusTimeText, {color}]}>{focusTimeText}</Text>
    }

    return ''
  }, [isFocusMode, getFocusTime, focusModeInfo, item.active_time])

  return (
    <View style={styles.container}>
      <Pressable onPress={handleClick}>
        <View style={styles.badgeContainer}>
          <View style={styles.badgeWrapper}>
            {isComplete && (
              <View style={completeBadge}>
                <Text style={completeBadgeText}>완료</Text>
              </View>
            )}
            {isFocusMode && (
              <View style={focusModeBadge}>
                <Text style={{fontSize: 10}}>🔥</Text>
                <Text style={focusModeBadgeText}>집중</Text>
              </View>
            )}
          </View>

          {focusTimeTextComponent}
        </View>

        <Text style={styles.titleText}>{item.title}</Text>

        <View style={styles.infoWrapper}>
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/folder.png')} style={styles.icon} />
            <Text style={styles.contentsText}>{scheduleCategoryTitle}</Text>
          </View>

          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/time.png')} style={styles.icon} />

            <Text style={styles.contentsText}>{`${getTimeText(item.start_time)} ~ ${getTimeText(item.end_time)}`}</Text>
          </View>

          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/calendar.png')} style={styles.icon} />
            <Text style={styles.contentsText}>
              {`${item.start_date} ~ ${item.end_date === '9999-12-31' ? '없음' : item.end_date}`}
            </Text>
          </View>

          <View style={styles.infoIconRow}>
            <RepeatIcon width={16} height={16} fill="#03cf5d" />

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
        </View>
      </Pressable>

      {item.todo_list?.length > 0 && <TodoList data={item.todo_list} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16
  },
  badgeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  badgeWrapper: {
    flexDirection: 'row',
    gap: 5
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium'
  },
  focusTimeText: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold'
  },
  infoWrapper: {
    gap: 7,
    marginTop: 10
  },
  infoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#424242'
  },

  contentsText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242'
  },

  dayOfWeekContainer: {
    flexDirection: 'row',
    gap: 3
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#babfc5'
  },
  activeDayOfWeekText: {
    color: '#424242'
  },
  icon: {
    width: 16,
    height: 16
  }
})

const completeBadge = StyleSheet.compose(styles.badge, {backgroundColor: '#32CD3220'})
const completeBadgeText = StyleSheet.compose(styles.badgeText, {color: '#32CD32'})
const focusModeBadge = StyleSheet.compose(styles.badge, {
  backgroundColor: '#FF000015',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3
})
const focusModeBadgeText = StyleSheet.compose(styles.badgeText, {color: '#FF0000'})

export default ScheduleItem
