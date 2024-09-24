import React, {ReactNode} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import TodoList from './src/TodoList'

import {useRecoilValue} from 'recoil'
import {scheduleCategoryListState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import RepeatIcon from '@/assets/icons/repeat.svg'

interface ScheduleTime {
  startTime: number
  endTime: number
}
interface ScheduleDate {
  startDate: string
  endDate: string
}
interface ScheduleDayOfWeek {
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}
interface Props {
  title: string
  categoryId?: number | null
  time?: ScheduleTime
  date?: ScheduleDate
  dayOfWeek?: ScheduleDayOfWeek
  todoList?: Todo[]
  headerComponent?: ReactNode
}
const ScheduleItem = ({title, categoryId, time, date, dayOfWeek, headerComponent, todoList}: Props) => {
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)

  const getDayOfWeekTextStyle = React.useCallback((value: string) => {
    return [styles.dayOfWeekText, value === '1' && styles.activeDayOfWeekText]
  }, [])

  const scheduleCategoryTitle = React.useMemo(() => {
    const target = scheduleCategoryList.find(scheduleCategory => {
      return scheduleCategory.schedule_category_id === categoryId
    })

    return target ? target.title : '미지정'
  }, [scheduleCategoryList, categoryId])

  const getTimeText = (value: number) => {
    const timeInfo = getTimeOfMinute(value)

    return `${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`
  }

  return (
    <View style={styles.container}>
      {headerComponent}

      <Text style={styles.titleText}>{title}</Text>

      <View style={styles.infoWrapper}>
        {categoryId && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/folder.png')} style={styles.icon} />
            <Text style={styles.contentsText}>{scheduleCategoryTitle}</Text>
          </View>
        )}

        {time && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/time.png')} style={styles.icon} />

            <Text style={styles.contentsText}>{`${getTimeText(time.startTime)} ~ ${getTimeText(time.endTime)}`}</Text>
          </View>
        )}

        {date && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/calendar.png')} style={styles.icon} />
            <Text style={styles.contentsText}>
              {`${date.startDate} ~ ${date.endDate === '9999-12-31' ? '없음' : date.endDate}`}
            </Text>
          </View>
        )}

        {dayOfWeek && (
          <View style={styles.infoIconRow}>
            <RepeatIcon width={16} height={16} fill="#03cf5d" />

            <View style={styles.dayOfWeekContainer}>
              <Text style={getDayOfWeekTextStyle(dayOfWeek.mon)}>월</Text>
              <Text style={getDayOfWeekTextStyle(dayOfWeek.tue)}>화</Text>
              <Text style={getDayOfWeekTextStyle(dayOfWeek.wed)}>수</Text>
              <Text style={getDayOfWeekTextStyle(dayOfWeek.thu)}>목</Text>
              <Text style={getDayOfWeekTextStyle(dayOfWeek.fri)}>금</Text>
              <Text style={getDayOfWeekTextStyle(dayOfWeek.sat)}>토</Text>
              <Text style={getDayOfWeekTextStyle(dayOfWeek.sun)}>일</Text>
            </View>
          </View>
        )}
      </View>

      {todoList && todoList.length > 0 && <TodoList data={todoList} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16
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

export default ScheduleItem
