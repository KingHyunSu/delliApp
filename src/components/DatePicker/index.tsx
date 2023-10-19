import React from 'react'
import {StyleSheet, FlatList, View, Text} from 'react-native'

import RangePicker from './src/RangePicker'
import ControlBar from './src/ControlBar'
import DateItem from './src/DateItem'

import {setDigit} from '@/utils/helper'
import {getDateList, getRemainPrevDateList, getRemainNextvDateList} from './utils/date'
import {RANGE_FLAG} from './utils/code'
import {Item, RangeFlag} from './type'
import {dateItemStyles} from './style'

interface Props {
  value: string | string[]
  range: boolean
  flag: RangeFlag
  onChangeFlag: Function
  onChange: Function
}
const DatePicker = ({value, range, flag, onChangeFlag, onChange}: Props) => {
  // 요일
  const weekdays = ['월', '화', '수', '목', '금', '토', '일']

  const [date, setDate] = React.useState(value)
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [dayList, setDateList] = React.useState<Item[]>([])

  React.useEffect(() => {
    if (Array.isArray(value)) {
      setCurrentDate(new Date(value[0]))
    } else {
      setCurrentDate(new Date(value))
    }

    setDate(value)
  }, [value])

  const changeDate = (item: Item) => {
    const dateStr = `${item.year}-${setDigit(item.month)}-${setDigit(item.day)}`

    if (Array.isArray(date)) {
      let [start, end] = [...date]

      if (flag === RANGE_FLAG.START) {
        start = dateStr
        if (new Date(start) > new Date(end)) {
          end = '9999-12-31'
        }
      } else if (flag === RANGE_FLAG.END) {
        if (dateStr === end) {
          end = '9999-12-31'
        } else {
          end = dateStr
          if (new Date(start) >= new Date(end)) {
            start = dateStr
          }
        }
      }

      setDate([start, end])
      onChange([start, end])
      return
    }

    setDate(dateStr)
    onChange(dateStr)
  }

  const changeCurrentDate = (data: Date) => {
    setCurrentDate(data)
  }

  React.useEffect(() => {
    const currentDateList = getDateList(currentDate)
    const remainPrevDateList = getRemainPrevDateList(currentDate)
    const remainNextDateList = getRemainNextvDateList(currentDate)

    setDateList([...remainPrevDateList, ...currentDateList, ...remainNextDateList])
  }, [currentDate])

  return (
    <View>
      {Array.isArray(date) && range && <RangePicker date={date} flag={flag} onChange={onChangeFlag} />}

      <ControlBar currentDate={currentDate} onChange={changeCurrentDate} />

      <View style={styles.weekContainer}>
        {weekdays.map(week => (
          <View key={week} style={dateItemStyles.wrapper}>
            <Text style={[dateItemStyles.text, styles.dayOfWeekText]}>{week}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={dayList}
        keyExtractor={(_, index) => String(index)}
        renderItem={({item}) => <DateItem item={item} value={date} onChange={changeDate} />}
        numColumns={7}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: 'row'
  },
  dayOfWeekText: {
    fontWeight: 'bold'
  }
})
export default DatePicker
