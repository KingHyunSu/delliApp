import React from 'react'
import {useWindowDimensions, StyleSheet, View, Pressable, Text} from 'react-native'

import ArrowTailLeftIcon from '@/assets/icons/arrow_tail_left.svg'
import ArrowTailRightIcon from '@/assets/icons/arrow_tail_right.svg'

import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {isSameDay, isSameMonth, isSameYear, isFirstDayOfMonth, isLastDayOfMonth, addDays} from 'date-fns'
import {getWeeklyDateList} from '../util'

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
  const dayOfWeekSize = width * 0.096
  const gapSize = (width - 32) * 0.0442
  const itemWidth = dayOfWeekSize + gapSize
  const containerWidth = itemWidth * 7

  const [weeklyDateList, setWeeklyDateList] = React.useState<DataListItem[]>([])
  React.useEffect(() => {
    const prevWeeklyDate = addDays(date, -7)
    const nextWeeklyDate = addDays(date, 7)

    const prevWeeklyDateList = getWeeklyDateList(prevWeeklyDate)
    const nextWeeklyDateList = getWeeklyDateList(nextWeeklyDate)

    setWeeklyDateList([
      {data: prevWeeklyDateList, x: -containerWidth},
      {data: currentWeeklyDateList, x: 0},
      {data: nextWeeklyDateList, x: containerWidth}
    ])
  }, [])

  const isActive = (item: Date) => {
    return isSameYear(item, date) && isSameMonth(item, date) && isSameDay(item, date)
  }
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
    list.unshift({data: prevWeeklyDateList, x: list[0].x - containerWidth})

    setWeeklyDateList([...list])
  }
  const handleNext = () => {
    const changeDate = addDays(date, 7)
    const nextWeeklyDate = addDays(date, 14)
    const nextWeeklyDateList = getWeeklyDateList(nextWeeklyDate)

    onChange(changeDate)

    const list = weeklyDateList
    list.push({data: nextWeeklyDateList, x: list[list.length - 1].x + containerWidth})

    setWeeklyDateList([...list])
  }

  const currentPosition = useSharedValue(0)
  const position = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      position.value = currentPosition.value + e.translationX
    })
    .onEnd(e => {
      if (e.translationX > 0) {
        // left
        currentPosition.value += containerWidth
        position.value = withTiming(currentPosition.value, {duration: 300}, isFinish => {
          if (isFinish) {
            runOnJS(handlePrev)()
          }
        })
      } else if (e.translationX < 0) {
        // right
        currentPosition.value -= containerWidth
        position.value = withTiming(currentPosition.value, {duration: 300}, isFinish => {
          if (isFinish) {
            runOnJS(handleNext)()
          }
        })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: position.value}]
  }))

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
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => onChange(item)}>
                  <Text style={[styles.text, isActive(item) && styles.activeText]}>{item.getDate()}</Text>
                </Pressable>
              </View>
            )
          })}
        </View>
      )
    })
  }, [weeklyDateList])

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
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 10,
    color: '#555'
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8'
  },
  activeItem: {
    backgroundColor: '#1E90FF'
  },
  text: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 14,
    color: '#7c8698'
  },
  activeText: {
    color: '#fff'
  }
})

export default DayPicker
