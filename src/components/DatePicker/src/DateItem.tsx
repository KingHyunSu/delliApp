import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import {format} from 'date-fns'
import {setDigit} from '@/utils/helper'
import {Item} from '../type'
import {dateItemStyles} from '../style'

interface DateItemProps {
  item: Item
  value: string
  onChange: Function
}

const DateItem = ({item, value, onChange}: DateItemProps) => {
  const isToday = React.useMemo(() => {
    return `${item.year}${setDigit(item.month)}${setDigit(item.day)}` === format(new Date(), 'yyyyMMdd')
  }, [item])

  const isActive = React.useMemo(() => {
    const itemYear = item.year
    const itemMonth = item.month
    const itemDay = item.day

    const [selectYear, selectMonth, selectDay] = value.split('-')

    const itemDateStr = `${itemYear}${setDigit(itemMonth)}${setDigit(itemDay)}`
    const selectDateStr = `${selectYear}${selectMonth}${selectDay}`

    return itemDateStr === selectDateStr
  }, [item, value])

  const getWrapperStyle = () => {
    let style: any = {
      width: 30,
      height: 30,
      borderRadius: 7,
      justifyContent: 'center',
      alignSelf: 'center'
    }

    if (isActive) {
      style = {...style, backgroundColor: '#1E90FF'}
    }
    if (!isActive && isToday) {
      style = {...style, backgroundColor: '#E8E8E8'}
    }

    return style
  }

  return (
    <Pressable style={dateItemStyles.wrapper} onPress={() => onChange(item)}>
      <View style={getWrapperStyle()}>
        <Text style={[dateItemStyles.text, !item.current && styles.remainDateText, isActive && styles.activeDateText]}>
          {item.day}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  remainDateText: {
    color: '#D2D2D4'
  },
  activeDateText: {
    color: '#fff'
  }
})

export default DateItem
