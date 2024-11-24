import {ReactNode, useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import TodoList from './src/TodoList'
import RoutineList from './src/RoutineList'

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
  routineList?: ScheduleRoutine[]
  todoList?: ScheduleTodo[]
  headerComponent?: ReactNode
  activeTheme: ActiveTheme
}
const ScheduleItem = ({
  title,
  categoryId,
  time,
  date,
  dayOfWeek,
  routineList,
  todoList,
  headerComponent,
  activeTheme
}: Props) => {
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)

  const backgroundColor = useMemo(() => {
    return activeTheme ? activeTheme.color6 : '#f5f6f8'
  }, [activeTheme])

  const textColor = useMemo(() => {
    return activeTheme ? activeTheme.color3 : '#424242'
  }, [activeTheme])

  const scheduleCategoryTitle = useMemo(() => {
    const target = scheduleCategoryList.find(scheduleCategory => {
      return scheduleCategory.schedule_category_id === categoryId
    })

    return target ? target.title : '미지정'
  }, [scheduleCategoryList, categoryId])

  const getTimeText = useCallback((value: number) => {
    const timeInfo = getTimeOfMinute(value)

    return `${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`
  }, [])

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {headerComponent}

      <Text style={[styles.titleText, {color: textColor}]}>{title}</Text>

      <View style={styles.infoWrapper}>
        {categoryId !== undefined && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/folder.png')} style={styles.icon} />
            <Text style={[styles.contentsText, {color: textColor}]}>{scheduleCategoryTitle}</Text>
          </View>
        )}

        {time !== undefined && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/time.png')} style={styles.icon} />

            <Text style={[styles.contentsText, {color: textColor}]}>{`${getTimeText(time.startTime)} ~ ${getTimeText(
              time.endTime
            )}`}</Text>
          </View>
        )}

        {date !== undefined && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/calendar.png')} style={styles.icon} />
            <Text style={[styles.contentsText, {color: textColor}]}>
              {`${date.startDate} ~ ${date.endDate === '9999-12-31' ? '없음' : date.endDate}`}
            </Text>
          </View>
        )}

        {dayOfWeek !== undefined && (
          <View style={styles.infoIconRow}>
            <RepeatIcon width={16} height={16} fill="#03cf5d" />

            <View style={styles.dayOfWeekContainer}>
              {dayOfWeek.mon === '1' && <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>월</Text>}
              {dayOfWeek.tue === '1' && <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>화</Text>}
              {dayOfWeek.wed === '1' && <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>수</Text>}
              {dayOfWeek.thu === '1' && <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>목</Text>}
              {dayOfWeek.fri === '1' && <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>금</Text>}
              {dayOfWeek.sat === '1' && <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>토</Text>}
              {dayOfWeek.sun === '1' && <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>일</Text>}
            </View>
          </View>
        )}
      </View>

      {routineList !== undefined && routineList.length > 0 && (
        <RoutineList data={routineList} activeTheme={activeTheme} />
      )}
      {todoList !== undefined && todoList.length > 0 && <TodoList data={todoList} activeTheme={activeTheme} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 14
  },
  icon: {
    width: 16,
    height: 16
  }
})

export default ScheduleItem
