import {ReactNode, useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import TodoList from './src/TodoList'

import {useRecoilValue} from 'recoil'
import {scheduleCategoryListState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import RepeatIcon from '@/assets/icons/repeat.svg'
import BullseyeIcon from '@/assets/icons/bullseye.svg'

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
interface Goal {
  title: string | null
  // activity_focus_time: number | null
  // activity_complete_count: number | null
  // total_focus_time: number | null
  // total_complete_count: number | null
}
interface Props {
  title: string
  categoryId?: number | null
  time?: ScheduleTime
  date?: ScheduleDate
  dayOfWeek?: ScheduleDayOfWeek
  goal?: Goal
  todoList?: Todo[]
  routineList?: Routine[]
  headerComponent?: ReactNode
  backgroundColor?: string | null
}
const ScheduleItem = ({
  title,
  categoryId,
  time,
  date,
  dayOfWeek,
  goal,
  todoList,
  routineList,
  headerComponent,
  backgroundColor
}: Props) => {
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)

  const containerStyle = useMemo(() => {
    const _backgroundColor = backgroundColor ? backgroundColor : '#f9f9f9'

    return [styles.container, {backgroundColor: _backgroundColor}]
  }, [backgroundColor])

  const scheduleCategoryTitle = useMemo(() => {
    const target = scheduleCategoryList.find(scheduleCategory => {
      return scheduleCategory.schedule_category_id === categoryId
    })

    return target ? target.title : '미지정'
  }, [scheduleCategoryList, categoryId])

  const getDayOfWeekTextStyle = useCallback((value: string) => {
    return [styles.dayOfWeekText, value === '1' && styles.activeDayOfWeekText]
  }, [])

  const getTimeText = useCallback((value: number) => {
    const timeInfo = getTimeOfMinute(value)

    return `${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`
  }, [])

  return (
    <View style={containerStyle}>
      {headerComponent}

      <Text style={styles.titleText}>{title}</Text>

      <View style={styles.infoWrapper}>
        {categoryId !== undefined && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/folder.png')} style={styles.icon} />
            <Text style={styles.contentsText}>{scheduleCategoryTitle}</Text>
          </View>
        )}

        {time !== undefined && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/time.png')} style={styles.icon} />

            <Text style={styles.contentsText}>{`${getTimeText(time.startTime)} ~ ${getTimeText(time.endTime)}`}</Text>
          </View>
        )}

        {date !== undefined && (
          <View style={styles.infoIconRow}>
            <Image source={require('@/assets/icons/calendar.png')} style={styles.icon} />
            <Text style={styles.contentsText}>
              {`${date.startDate} ~ ${date.endDate === '9999-12-31' ? '없음' : date.endDate}`}
            </Text>
          </View>
        )}

        {dayOfWeek !== undefined && (
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

        {goal !== undefined && goal.title && (
          <View style={styles.infoIconRow}>
            <BullseyeIcon width={16} height={16} />
            <Text style={styles.contentsText}>{goal.title}</Text>
          </View>
        )}

        {/*{goal !== undefined && goal.title && (*/}
        {/*  <View style={styles.goalContainer}>*/}
        {/*    <View style={styles.infoIconRow}>*/}
        {/*      <BullseyeIcon width={16} height={16} />*/}
        {/*      <Text style={styles.contentsText}>{goal.title}</Text>*/}
        {/*    </View>*/}

        {/*    <View style={styles.goalItemContainer}>*/}
        {/*      <View style={styles.goalItemWrapper}>*/}
        {/*        <Text style={styles.goalItemLabel}>일정 완료</Text>*/}

        {/*        <View>*/}
        {/*          <Text style={styles.goalItemText}>{5}회</Text>*/}

        {/*          <View style={styles.goalItemPercentageContainer}>*/}
        {/*            <View style={styles.goalItemPercentageWrapper}>*/}
        {/*              <View*/}
        {/*                style={{*/}
        {/*                  width: '50%',*/}
        {/*                  height: 10,*/}
        {/*                  borderRadius: 10,*/}
        {/*                  backgroundColor: '#66BB6A'*/}
        {/*                }}*/}
        {/*              />*/}
        {/*            </View>*/}

        {/*            <Text style={styles.goalItemPercentageText}>50%</Text>*/}
        {/*          </View>*/}
        {/*        </View>*/}
        {/*      </View>*/}

        {/*      <View style={styles.goalItemWrapper}>*/}
        {/*        <Text style={styles.goalItemLabel}>집중한 시간</Text>*/}

        {/*        <View>*/}
        {/*          <Text style={styles.goalItemText}>1시간 20분</Text>*/}

        {/*          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>*/}
        {/*            <View style={{flex: 1, height: 10, borderRadius: 10, backgroundColor: '#ffffff'}}>*/}
        {/*              <View*/}
        {/*                style={{*/}
        {/*                  width: '30%',*/}
        {/*                  height: 10,*/}
        {/*                  borderRadius: 10,*/}
        {/*                  backgroundColor: '#FF6B6B'*/}
        {/*                }}*/}
        {/*              />*/}
        {/*            </View>*/}

        {/*            <Text style={styles.goalItemPercentageText}>30%</Text>*/}
        {/*          </View>*/}
        {/*        </View>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*)}*/}
      </View>

      {routineList !== undefined && routineList.length > 0 && <TodoList data={routineList} />}
      {todoList !== undefined && todoList.length > 0 && <TodoList data={todoList} />}
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

  // goalContainer: {
  //   marginTop: 5,
  //   paddingHorizontal: 10,
  //   paddingBottom: 10,
  //   paddingTop: 15,
  //   backgroundColor: '#ffffff',
  //   borderRadius: 10,
  //   gap: 10
  // },
  // goalItemContainer: {
  //   flexDirection: 'row',
  //   gap: 10
  // },
  // goalItemWrapper: {
  //   flex: 1,
  //   gap: 10,
  //   padding: 10,
  //   borderRadius: 10,
  //   backgroundColor: '#f9f9f9'
  // },
  // goalItemLabel: {
  //   fontFamily: 'Pretendard-Medium',
  //   fontSize: 12,
  //   color: '#8d9195'
  // },
  // goalItemText: {
  //   fontFamily: 'Pretendard-Medium',
  //   fontSize: 12,
  //   color: '#424242',
  //   marginBottom: 5
  // },
  // goalItemPercentageContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 10
  // },
  // goalItemPercentageWrapper: {
  //   flex: 1,
  //   height: 10,
  //   borderRadius: 10,
  //   backgroundColor: '#ffffff'
  // },
  // goalItemPercentageText: {
  //   fontFamily: 'Pretendard-Bold',
  //   fontSize: 12,
  //   color: '#424242'
  // }
})

export default ScheduleItem
