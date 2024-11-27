import {useState, useCallback, useLayoutEffect, useEffect} from 'react'
import {ListRenderItem, StyleSheet, FlatList, View, Text} from 'react-native'
import ControlBar from './src/ControlBar'
import DateItem from './src/DateItem'

import {dateItemStyles} from './style'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'
import {format, startOfMonth, startOfWeek, addDays} from 'date-fns'

interface Props {
  value: string | null
  hasNull?: boolean
  disableDate?: string
  onChange: (value: string) => void
}

const DatePicker = ({value: datePickerValue, hasNull = false, disableDate, onChange}: Props) => {
  // 요일
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dateList, setDateList] = useState<Date[]>([])

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
    if (datePickerValue && datePickerValue !== '9999-12-31') {
      setCurrentDate(new Date(datePickerValue))
    }
    setSelectedDate(datePickerValue)
  }, [datePickerValue])

  const changeDate = useCallback(
    (value: Date) => {
      let formatedValue = format(value, 'yyyy-MM-dd')

      if (hasNull && formatedValue === selectedDate) {
        formatedValue = '9999-12-31'
      }

      setSelectedDate(formatedValue)
      onChange(formatedValue)
    },
    [selectedDate, hasNull, setSelectedDate, onChange]
  )

  const changeCurrentDate = useCallback((data: Date) => {
    setCurrentDate(data)
  }, [])

  const getItemLayout = useCallback((_, index: number) => {
    return {
      length: 30,
      offset: 30 * index,
      index
    }
  }, [])

  useLayoutEffect(() => {
    const monthStart = startOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = addDays(startDate, 34)

    const _dateList = []
    let _date = startDate

    while (_date <= endDate) {
      _dateList.push(_date)
      _date = addDays(_date, 1)
    }

    setDateList(_dateList)
  }, [currentDate])

  const renderItem: ListRenderItem<Date> = useCallback(
    ({item}) => {
      return (
        <DateItem
          item={item}
          value={selectedDate}
          disableDate={disableDate}
          activeTheme={activeTheme}
          onChange={changeDate}
        />
      )
    },
    [selectedDate, disableDate, activeTheme, changeDate]
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
        data={dateList}
        keyExtractor={(item, index) => String(index)}
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
}

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: 'row'
  }
})
export default DatePicker
