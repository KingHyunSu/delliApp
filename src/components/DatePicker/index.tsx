import {forwardRef, useImperativeHandle, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, FlatList, View, Text} from 'react-native'

import ControlBar from './src/ControlBar'
import DateItem from './src/DateItem'

import {setDigit} from '@/utils/helper'
import {getDateList, getRemainPrevDateList, getRemainNextDateList} from './utils/date'
import {Item} from './type'
import {dateItemStyles} from './style'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'
import {format} from 'date-fns'

interface DateItemParams {
  item: Item
}
interface Props {
  value: string | null
  hasNull?: boolean
  disableDate?: string
  onChange: (value: string) => void
}
export interface Refs {
  today: () => void
}
const DatePicker = forwardRef<Refs, Props>((props, ref) => {
  const {value: datePickerValue, hasNull = false, disableDate, onChange} = props

  // 요일
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  const [date, setDate] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [dayList, setDateList] = useState<Item[]>([])

  const activeTheme = useRecoilValue(activeThemeState)

  const getWeekStyle = useCallback(
    (dayOfWeekIndex: number) => {
      let color = activeTheme.color7

      if (dayOfWeekIndex === 0) {
        color = '#FF3D58'
      } else if (dayOfWeekIndex === 6) {
        color = '#556FFF'
      }
      return [dateItemStyles.text, {color}]
    },
    [activeTheme.color7]
  )

  useEffect(() => {
    setDate(datePickerValue)
  }, [datePickerValue])

  useEffect(() => {
    if ((hasNull && date === '9999-12-31') || !date) {
      setCurrentDate(new Date())
    } else {
      setCurrentDate(new Date(date))
    }
  }, [date, hasNull])

  const changeDate = useCallback(
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

  const changeCurrentDate = useCallback((data: Date) => {
    setCurrentDate(data)
  }, [])

  const getKey = useCallback((item: Item, index: number) => {
    return String(index)
  }, [])

  const getItemLayout = useCallback((_, index: number) => {
    return {
      length: 30,
      offset: 30 * index,
      index
    }
  }, [])

  useEffect(() => {
    if (currentDate) {
      const currentDateList = getDateList(currentDate)
      const remainPrevDateList = getRemainPrevDateList(currentDate)
      const remainNextDateList = getRemainNextDateList(currentDate)

      setDateList([...remainPrevDateList, ...currentDateList, ...remainNextDateList])
    }
  }, [currentDate])

  useImperativeHandle(
    ref,
    () => {
      return {
        today() {
          const today = new Date()
          const todayFormat = format(new Date(), 'yyyy-MM-dd')

          setCurrentDate(today)
          onChange(todayFormat)
        }
      }
    },
    [onChange]
  )

  const renderItem = useCallback(
    ({item}: DateItemParams) => {
      return (
        <DateItem item={item} value={date} disableDate={disableDate} activeTheme={activeTheme} onChange={changeDate} />
      )
    },
    [date, disableDate, activeTheme, changeDate]
  )

  return (
    <View>
      <ControlBar activeTheme={activeTheme} currentDate={currentDate} onChange={changeCurrentDate} />

      <View style={styles.weekContainer}>
        {weekdays.map((week, index) => (
          <View key={week} style={dateItemStyles.wrapper}>
            <Text style={getWeekStyle(index)}>{week}</Text>
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
  }
})
export default DatePicker
