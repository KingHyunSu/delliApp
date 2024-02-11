import React from 'react'
import {StyleSheet, FlatList, View, Text} from 'react-native'

import ControlBar from './src/ControlBar'
import DateItem from './src/DateItem'

import {setDigit} from '@/utils/helper'
import {getDateList, getRemainPrevDateList, getRemainNextvDateList} from './utils/date'
import {Item} from './type'
import {dateItemStyles} from './style'

interface DateItemParams {
  item: Item
}
interface Props {
  value: string
  hasNull?: boolean
  onChange: Function
}
const DatePicker = React.memo(({value: datePickerValue, hasNull = false, onChange}: Props) => {
  // 요일
  const weekdays = ['월', '화', '수', '목', '금', '토', '일']

  const [date, setDate] = React.useState<string | null>(null)
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null)
  const [dayList, setDateList] = React.useState<Item[]>([])

  const weekStyle = React.useMemo(() => {
    return [dateItemStyles.text, styles.dayOfWeekText]
  }, [])

  React.useEffect(() => {
    setDate(datePickerValue)
  }, [datePickerValue])

  React.useEffect(() => {
    if (date) {
      if (hasNull && date === '9999-12-31') {
        setCurrentDate(new Date())
      } else {
        setCurrentDate(new Date(date))
      }
    }
  }, [date, hasNull])

  const changeDate = React.useCallback(
    (item: Item) => {
      let dateStr = `${item.year}-${setDigit(item.month)}-${setDigit(item.day)}`

      if (hasNull && dateStr === date) {
        dateStr = '9999-12-31'
      }

      setDate(dateStr)
      onChange(dateStr)
    },
    [date, hasNull, setDate, onChange]
  )

  const changeCurrentDate = React.useCallback((data: Date) => {
    setCurrentDate(data)
  }, [])

  const getKey = React.useCallback((item: Item, index: number) => {
    return String(index)
  }, [])

  const renderItem = React.useCallback(
    ({item}: DateItemParams) => {
      return <DateItem item={item} value={date} onChange={changeDate} />
    },
    [date, changeDate]
  )

  const getItemLayout = React.useCallback((_, index: number) => {
    return {
      length: 30,
      offset: 30 * index,
      index
    }
  }, [])

  React.useEffect(() => {
    if (currentDate) {
      const currentDateList = getDateList(currentDate)
      const remainPrevDateList = getRemainPrevDateList(currentDate)
      const remainNextDateList = getRemainNextvDateList(currentDate)

      setDateList([...remainPrevDateList, ...currentDateList, ...remainNextDateList])
    }
  }, [currentDate])

  return (
    <View>
      <ControlBar currentDate={currentDate} onChange={changeCurrentDate} />

      <View style={styles.weekContainer}>
        {weekdays.map(week => (
          <View key={week} style={dateItemStyles.wrapper}>
            <Text style={weekStyle}>{week}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={dayList}
        keyExtractor={getKey}
        renderItem={renderItem}
        numColumns={7}
        initialNumToRender={49}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: 'row'
  },
  dayOfWeekText: {
    fontWeight: 'bold'
  }
})
export default DatePicker
