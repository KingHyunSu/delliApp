import React from 'react'
import {View, Text, Pressable} from 'react-native'

import {format, isWithinInterval} from 'date-fns'
import {setDigit} from '@/utils/helper'
import {Item} from '../type'
import {dateItemStyles} from '../style'

interface DateItemProps {
  item: Item
  value: string | string[]
  onChange: Function
}

const DateItem = ({item, value, onChange}: DateItemProps) => {
  const isRange = React.useMemo(() => {
    return Array.isArray(value)
  }, [value])

  const isToday = React.useMemo(() => {
    return `${item.year}${setDigit(item.month)}${setDigit(item.day)}` === format(new Date(), 'yyyyMMdd')
  }, [item])

  const isActive = React.useMemo(() => {
    const itemYear = item.year
    const itemMonth = item.month
    const itemDay = item.day

    if (Array.isArray(value)) {
      const itemDate = new Date(`${itemYear}-${itemMonth}-${itemDay}`)

      if (value.length === 2) {
        const [start, end] = value

        return isWithinInterval(itemDate, {
          start: new Date(start),
          end: new Date(end)
        })
      }

      return false
    }

    const [selectYear, selectMonth, selectDay] = value.split('-')

    const itemDateStr = `${itemYear}${setDigit(itemMonth)}${setDigit(itemDay)}`
    const selectDateStr = `${selectYear}${selectMonth}${selectDay}`

    return itemDateStr === selectDateStr
  }, [item, value])

  const isFirstRange = React.useMemo(() => {
    if (Array.isArray(value)) {
      return `${item.year}-${setDigit(item.month)}-${setDigit(item.day)}` === value[0]
    }
    return false
  }, [item, value])

  const isLastRange = React.useMemo(() => {
    if (Array.isArray(value)) {
      return `${item.year}-${setDigit(item.month)}-${setDigit(item.day)}` === value[1]
    }
    return false
  }, [item, value])

  const getWrapperStyle = () => {
    let style: any = {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignSelf: 'center'
    }

    if (isRange) {
      if (value.length === 1 || value[0] === value[1]) {
        style = {...style, borderRadius: 15}
      } else {
        style = {...style, width: '100%'}

        if (isFirstRange) {
          style = {...style, borderTopLeftRadius: 7, borderBottomLeftRadius: 7}
        }
        if (isLastRange) {
          style = {...style, borderTopRightRadius: 7, borderBottomRightRadius: 7}
        }
        if (!isFirstRange && !isLastRange && isActive) {
          style = {...style, borderRadius: 0}
        }
      }
    } else {
      style = {...style, borderRadius: 15}
    }

    if (isActive) {
      style = {...style, backgroundColor: '#1E90FF'}
    }
    if (!isActive && isToday) {
      style = {...style, backgroundColor: '#E8E8E8', width: 30, borderRadius: 15}
    }

    return style
  }

  return (
    <Pressable style={dateItemStyles.wrapper} onPress={() => onChange(item)}>
      <View style={getWrapperStyle()}>
        <Text
          style={[
            dateItemStyles.text,
            !item.current && {color: '#D2D2D4'},
            isActive && {color: '#fff', fontWeight: 'bold'}
          ]}>
          {item.day}
        </Text>
      </View>
    </Pressable>
  )
}

export default DateItem
