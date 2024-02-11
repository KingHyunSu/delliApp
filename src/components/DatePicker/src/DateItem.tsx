import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import {format, isBefore} from 'date-fns'
import {setDigit} from '@/utils/helper'
import {Item} from '../type'
import {dateItemStyles} from '../style'

interface DateItemProps {
  item: Item
  value: string | null
  disableDate?: string
  onChange: Function
}

const DateItem = React.memo(({item, value, disableDate, onChange}: DateItemProps) => {
  const isToday = React.useMemo(() => {
    return `${item.year}${setDigit(item.month)}${setDigit(item.day)}` === format(new Date(), 'yyyyMMdd')
  }, [item])

  const isActive = React.useMemo(() => {
    if (!value) {
      return false
    }

    const itemYear = item.year
    const itemMonth = item.month
    const itemDay = item.day

    const [selectYear, selectMonth, selectDay] = value.split('-')

    const itemDateStr = `${itemYear}${setDigit(itemMonth)}${setDigit(itemDay)}`
    const selectDateStr = `${selectYear}${selectMonth}${selectDay}`

    return itemDateStr === selectDateStr
  }, [item, value])

  const isDisable = React.useMemo(() => {
    if (disableDate) {
      return isBefore(new Date(`${item.year}-${item.month}-${item.day}`), new Date(disableDate))
    }

    return false
  }, [item.year, item.month, item.day, disableDate])

  const handleChange = React.useCallback(() => {
    if (isDisable) {
      return
    }

    onChange(item)
  }, [isDisable, onChange, item])

  const textStyles = React.useMemo(() => {
    return [
      dateItemStyles.text,
      isToday && styles.todayDateText,
      isActive && styles.activeDateText,
      isDisable && styles.disableDateText,
      !item.current && styles.remainDateText
    ]
  }, [item, isToday, isActive, isDisable])

  return (
    <Pressable style={dateItemStyles.wrapper} onPress={handleChange}>
      <View style={styles.item}>
        <Text style={textStyles}>{item.day}</Text>
      </View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  item: {
    width: 30,
    height: 30,
    borderRadius: 7,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  remainDateText: {
    color: '#D2D2D4'
  },
  activeDateText: {
    fontFamily: 'Pretendard-Bold',
    color: '#1E90FF'
  },
  disableDateText: {
    color: '#7c8698'
  },
  todayDateText: {
    fontFamily: 'Pretendard-Bold'
  }
})

export default DateItem
