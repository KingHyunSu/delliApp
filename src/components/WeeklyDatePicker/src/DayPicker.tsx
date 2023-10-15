import React from 'react'
import {useWindowDimensions, StyleSheet, View, Pressable, Text} from 'react-native'

import {addDays, eachDayOfInterval, isSameDay, isSameMonth, isSameYear} from 'date-fns'

interface Props {
  date: Date
  onChange: Function
}
const DayPicker = ({date, onChange}: Props) => {
  const {width} = useWindowDimensions()
  const dayOfWeekSize = width * 0.096
  const [dateList, setDateList] = React.useState<Array<Date>>([])

  React.useEffect(() => {
    const dayOfWeekIndex = date.getDay() === 0 ? 6 : date.getDay() - 1

    const startDate = addDays(date, -dayOfWeekIndex)
    const endDate = addDays(date, 6 - dayOfWeekIndex)

    const list = eachDayOfInterval({start: startDate, end: endDate})
    setDateList(list)
  }, [date])

  const isActive = (item: Date) => {
    return isSameYear(item, date) && isSameMonth(item, date) && isSameDay(item, date)
  }

  return (
    <View style={styles.container}>
      {dateList.map((item, index) => {
        return (
          <Pressable
            style={[
              styles.item,
              isActive(item) && styles.activeItem,
              {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
            ]}
            key={index}
            onPress={() => onChange(item)}>
            <Text style={[styles.text, isActive(item) && styles.activeText]}>{item.getDate()}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8'
  },
  activeItem: {
    backgroundColor: '#1E90FF'
  },
  text: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 14,
    color: '#7c8698'
  },
  activeText: {
    color: '#fff'
  }
})

export default DayPicker
