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
  activeTheme: ActiveTheme
  onChange: Function
}

const DateItem = React.memo(({item, value, disableDate, activeTheme, onChange}: DateItemProps) => {
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

  const itemStyle = React.useMemo(() => {
    if (isActive) {
      return activeItemStyle
    }
    return isActive ? activeItemStyle : styles.item
  }, [isActive])

  const textStyle = React.useMemo(() => {
    let color = activeTheme.color3

    if (isActive || isToday) {
      color = '#1E90FF'
    } else if (isDisable) {
      color = activeTheme.color8
    }

    return [dateItemStyles.text, {color}]
  }, [activeTheme.color3, activeTheme.color8, isToday, isActive, isDisable])

  return (
    <Pressable style={dateItemStyles.wrapper} onPress={handleChange}>
      <View style={itemStyle}>
        <Text style={textStyle}>{item.day}</Text>
      </View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  item: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignSelf: 'center'
  }
})

const activeItemStyle = StyleSheet.compose(styles.item, {
  backgroundColor: '#1E90FF20',
  borderRadius: 15
})

export default DateItem
