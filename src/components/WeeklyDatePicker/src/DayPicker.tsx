import React from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'

import {addDays, eachDayOfInterval, isSameDay, isSameMonth, isSameYear} from 'date-fns'

interface Props {
  date: Date
  onChange: Function
}
const DayPicker = ({date, onChange}: Props) => {
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
    <View style={dayPickerStyles.container}>
      {dateList.map((item, index) => {
        return (
          <Pressable
            style={[dayPickerStyles.item, isActive(item) && dayPickerStyles.activeItem]}
            key={index}
            onPress={() => onChange(item)}>
            <Text style={isActive(item) && dayPickerStyles.activeText}>{item.getDate()}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const dayPickerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',

    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f6f8'
  },
  activeItem: {
    backgroundColor: '#1E90FF'
  },
  activeText: {
    color: '#fff'
  }
})

export default DayPicker
