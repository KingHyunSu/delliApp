import React from 'react'
import {StyleSheet, Pressable, View, Text, Image} from 'react-native'
import TodoList from './src/TodoList'

import {useRecoilValue} from 'recoil'
import {scheduleCategoryListState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import RepeatIcon from '@/assets/icons/repeat.svg'

interface Props {
  item: Schedule
  backgroundColor?: string
  textColor?: string
  onClick?: (value: Schedule) => void
}
const ScheduleItem = ({item, backgroundColor, textColor, onClick}: Props) => {
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)

  const containerStyle = React.useMemo(() => {
    const color = backgroundColor ? backgroundColor : '#f5f8ff'

    return [styles.container, {backgroundColor: color}]
  }, [])

  const getDayOfWeekTextStyle = React.useCallback((value: string) => {
    return [styles.dayOfWeekText, value === '1' && styles.activeDayOfWeekText]
  }, [])

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

  return (
    <View style={containerStyle}>
      <Pressable onPress={handleClick}>
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
