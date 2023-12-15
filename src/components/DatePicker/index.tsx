import React from 'react'
import {StyleSheet, FlatList, View, Text} from 'react-native'

import RangePicker from './src/RangePicker'
import ControlBar from './src/ControlBar'
import DateItem from './src/DateItem'

import {setDigit} from '@/utils/helper'
import {getDateList, getRemainPrevDateList, getRemainNextvDateList} from './utils/date'
import {Item} from './type'
import {dateItemStyles} from './style'

import {RANGE_FLAG} from '@/utils/types'

interface Props {
  value: string | string[]
  range: boolean
  flag: RANGE_FLAG
  onChangeFlag?: Function
  onChange: Function
}
const DatePicker = ({value, range, flag, onChangeFlag, onChange}: Props) => {
  // 요일
  const weekdays = ['월', '화', '수', '목', '금', '토', '일']

  const [date, setDate] = React.useState<string | string[] | null>(null)
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null)
  const [dayList, setDateList] = React.useState<Item[]>([])

  React.useEffect(() => {
    setDate(value)
  }, [])

  React.useEffect(() => {
    if (date) {
      if (Array.isArray(date)) {
        if (flag === RANGE_FLAG.START) {
          setCurrentDate(new Date(date[0]))
        } else if (flag === RANGE_FLAG.END) {
          if (date[1] === '9999-12-31') {
            setCurrentDate(new Date(date[0]))
          } else {
            setCurrentDate(new Date(date[1]))
          }
        }
      } else {
        setCurrentDate(new Date(date))
      }
    }
  }, [flag, date])

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
    if (currentDate) {
      const currentDateList = getDateList(currentDate)
      const remainPrevDateList = getRemainPrevDateList(currentDate)
      const remainNextDateList = getRemainNextvDateList(currentDate)

      setDateList([...remainPrevDateList, ...currentDateList, ...remainNextDateList])
    }
  }, [currentDate])

  if (!date && !currentDate) {
    return (
      <View>
        <Text>loading....</Text>
      </View>
    )
  }

  return (
    <View>
      {date && currentDate ? (
        <>
          {Array.isArray(date) && range && <RangePicker value={date} flag={flag} onChange={onChangeFlag} />}

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
