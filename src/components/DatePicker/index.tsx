import React from 'react'
import {StyleSheet, FlatList, View, Text} from 'react-native'

import ControlBar from './src/ControlBar'
import DateItem from './src/DateItem'

import {setDigit} from '@/utils/helper'
import {getDateList, getRemainPrevDateList, getRemainNextvDateList} from './utils/date'
import {Item} from './type'
import {dateItemStyles} from './style'

interface Props {
  value: string
  onChange: Function
}
const DatePicker = ({value, onChange}: Props) => {
  // 요일
  const weekdays = ['월', '화', '수', '목', '금', '토', '일']

  const [date, setDate] = React.useState<string | null>(null)
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null)
  const [dayList, setDateList] = React.useState<Item[]>([])

  React.useEffect(() => {
    setDate(value)
  }, [value])

  React.useEffect(() => {
    if (date) {
      setCurrentDate(new Date(date))
    }
  }, [date])

  const changeDate = (item: Item) => {
    const dateStr = `${item.year}-${setDigit(item.month)}-${setDigit(item.day)}`

    setDate(dateStr)
    onChange(dateStr)
  }

  const changeCurrentDate = (data: Date) => {
    setCurrentDate(data)
  }

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
      {date && currentDate ? (
        <>
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
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          />
        </>
      ) : (
        <Text>loading...</Text>
      )}
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
