import React from 'react'
import {useWindowDimensions, StyleSheet, View, Pressable, Text} from 'react-native'

import ArrowTailLeftIcon from '@/assets/icons/arrow_tail_left.svg'
import ArrowTailRightIcon from '@/assets/icons/arrow_tail_right.svg'

import {isSameDay, isSameMonth, isSameYear, isFirstDayOfMonth, isLastDayOfMonth} from 'date-fns'

interface Props {
  date: Date
  weeklyDateList: Date[]
  onChange: Function
}
const DayPicker = ({date, weeklyDateList, onChange}: Props) => {
  const {width} = useWindowDimensions()
  const dayOfWeekSize = width * 0.096

  const isActive = (item: Date) => {
    return isSameYear(item, date) && isSameMonth(item, date) && isSameDay(item, date)
  }

  const isPrevMonthInfo = (item: Date) => {
    const day = item.getDay()

    return day > 1 && isLastDayOfMonth(item)
  }

  const isNextMonthInfo = (item: Date) => {
    const day = item.getDay()

    return day > 1 && isFirstDayOfMonth(item)
  }

  return (
    <View style={styles.container}>
      {weeklyDateList.map((item, index) => {
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
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
