import React from 'react'
import {useWindowDimensions, StyleSheet, View, Pressable, Text} from 'react-native'

import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {isSameDay, isSameMonth, isSameYear, addDays} from 'date-fns'
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

  const getDayOfWeekStr = (index: number) => {
    switch (index) {
      case 0:
        return '월'
      case 1:
        return '화'
      case 2:
        return '수'
      case 3:
        return '목'
      case 4:
        return '금'
      case 5:
        return '토'
      case 6:
        return '일'
      default:
        ''
    }
  }
  const isActive = React.useCallback(
    (item: Date) => {
      return isSameYear(item, date) && isSameMonth(item, date) && isSameDay(item, date)
    },
    [date]
  )

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
              <Pressable
                key={index}
                style={[styles.item, {width: dayOfWeekSize, height: dayOfWeekSize + 5}]}
                onPress={() => handleDateChanged(item)}>
                <Text style={[styles.dayOfWeekText, isActive(item) && styles.activeText]}>
                  {getDayOfWeekStr(index)}
                </Text>
                <Text style={[styles.text, isActive(item) && styles.activeText]}>{item.getDate()}</Text>
              </Pressable>
            )
          })}
        </View>
      )
    })
  }, [weeklyDateList, isActive, dayOfWeekSize, handleDateChanged])

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, {height: dayOfWeekSize + 5}]}>{elementList}</Animated.View>
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
  item: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeItem: {
    color: '#1E90FF'
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#7c8698'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  activeText: {
    color: '#1E90FF'
  }
})

export default DayPicker
