import React from 'react'
import {useWindowDimensions, Platform, StyleSheet, View, Pressable, Text} from 'react-native'

import ArrowTailLeftIcon from '@/assets/icons/arrow_tail_left.svg'
import ArrowTailRightIcon from '@/assets/icons/arrow_tail_right.svg'

import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {isSameDay, isSameMonth, isSameYear, isFirstDayOfMonth, isLastDayOfMonth, addDays} from 'date-fns'
import {getWeeklyDateList} from '../util'
import {trigger} from 'react-native-haptic-feedback'

interface DataListItem {
  data: Date[]
  x: number
}
interface Props {
  date: Date
  currentWeeklyDateList: Date[]
  onChange: Function
}
const DayPicker = ({date, currentWeeklyDateList, onChange}: Props) => {
  const {width} = useWindowDimensions()
  const dayOfWeekSize = 36

  const [isLoading, setLoading] = React.useState(false)
  const [weeklyDateList, setWeeklyDateList] = React.useState<DataListItem[]>([])

  const isActive = React.useCallback(
    (item: Date) => {
      return isSameYear(item, date) && isSameMonth(item, date) && isSameDay(item, date)
    },
    [date]
  )

  const isPrevMonthInfo = (item: Date) => {
    return item.getDay() !== 0 && isLastDayOfMonth(item)
  }
  const isNextMonthInfo = (item: Date) => {
    return item.getDay() !== 1 && isFirstDayOfMonth(item)
  }

  const handlePrev = () => {
    const changeDate = addDays(date, -7)
    const prevWeeklyDate = addDays(date, -14)
    const prevWeeklyDateList = getWeeklyDateList(prevWeeklyDate)

    onChange(changeDate)

    const list = weeklyDateList
    list.unshift({data: prevWeeklyDateList, x: list[0].x - width})
    list.pop()

    setWeeklyDateList([...list])
    setLoading(false)
  }
  const handleNext = () => {
    const changeDate = addDays(date, 7)
    const nextWeeklyDate = addDays(date, 14)
    const nextWeeklyDateList = getWeeklyDateList(nextWeeklyDate)

    onChange(changeDate)

    const list = weeklyDateList
    list.push({data: nextWeeklyDateList, x: list[list.length - 1].x + width})
    list.shift()

    setWeeklyDateList([...list])
    setLoading(false)
  }

  const handleDateChanged = React.useCallback(
    (item: Date) => {
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
      }
      trigger('impactMedium', options)

      onChange(item)
    },
    [onChange]
  )

  const currentPosition = useSharedValue(0)
  const position = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      position.value = currentPosition.value + e.translationX
    })
    .onEnd(e => {
      runOnJS(setLoading)(true)
      if (e.translationX > 0) {
        // left
        currentPosition.value += width
        position.value = withTiming(currentPosition.value, {duration: 400}, isFinish => {
          if (isFinish) {
            runOnJS(handlePrev)()
          }
        })
      } else if (e.translationX < 0) {
        // right
        currentPosition.value -= width
        position.value = withTiming(currentPosition.value, {duration: 400}, isFinish => {
          if (isFinish) {
            runOnJS(handleNext)()
          }
        })
      }
    })
    .enabled(!isLoading)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: position.value}]
  }))

  React.useEffect(() => {
    const prevWeeklyDate = addDays(date, -7)
    const nextWeeklyDate = addDays(date, 7)

    const prevWeeklyDateList = getWeeklyDateList(prevWeeklyDate)
    const nextWeeklyDateList = getWeeklyDateList(nextWeeklyDate)

    if (weeklyDateList.length > 0) {
      setWeeklyDateList([
        {data: prevWeeklyDateList, x: weeklyDateList[0].x},
        {data: currentWeeklyDateList, x: weeklyDateList[1].x},
        {data: nextWeeklyDateList, x: weeklyDateList[2].x}
      ])
    } else {
      setWeeklyDateList([
        {data: prevWeeklyDateList, x: -width},
        {data: currentWeeklyDateList, x: 0},
        {data: nextWeeklyDateList, x: width}
      ])
    }
  }, [date])

  const elementList = React.useMemo(() => {
    return weeklyDateList.map((dataList, listIndex) => {
      return (
        <View key={listIndex} style={[styles.section, {transform: [{translateX: dataList.x}]}]}>
          {dataList.data.map((item, index) => {
            return (
              <View key={index} style={styles.wrapper}>
                {isPrevMonthInfo(item) && (
                  <View style={styles.infoWrapper}>
                    <ArrowTailLeftIcon stroke="#555" />
                    <Text style={styles.infoText}>{item.getMonth() + 1}월</Text>
                  </View>
                )}
                {isNextMonthInfo(item) && (
                  <View style={styles.infoWrapper}>
                    <Text style={styles.infoText}>{item.getMonth() + 1}월</Text>
                    <ArrowTailRightIcon stroke="#555" />
                  </View>
                )}
                <Pressable
                  style={[
                    styles.item,
                    isActive(item) && styles.activeItem,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize}
                  ]}
                  onPress={() => handleDateChanged(item)}>
                  <Text style={[styles.text, isActive(item) && styles.activeText]}>{item.getDate()}</Text>
                </Pressable>
              </View>
            )
          })}
        </View>
      )
    })
  }, [weeklyDateList, isActive, dayOfWeekSize, handleDateChanged])

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, {height: dayOfWeekSize}]}>{elementList}</Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  wrapper: {
    position: 'relative'
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    gap: 3,
    top: -17
  },
  infoText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 10,
    color: '#555'
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',

    ...Platform.select({
      ios: {
        shadowColor: '#555',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      android: {
        elevation: 3
      }
    })
  },
  activeItem: {
    backgroundColor: '#1E90FF'
  },
  text: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#7c8698'
  },
  activeText: {
    color: '#fff'
  }
})

export default DayPicker
