import React from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'

import {addDays, addMonths, setDate, lastDayOfMonth} from 'date-fns'

interface Props {
  date: Date
  setDate: Function
}
const WeekController = ({date, setDate: setCurrentDate}: Props) => {
  const THURSDAY_NUMBER = 4

  const [screenMonth, setScreenMonth] = React.useState(date.getMonth() + 1)
  const [screenWeek, setScreenWeek] = React.useState(0)

  React.useEffect(() => {
    const prevDate = addMonths(date, -1)
    const prevLastDate = lastDayOfMonth(prevDate)

    let weekOfMonth = getWeekOfMonth(date)

    const currentDateOfFirstDayOfWeek = setDate(date, 1).getDay()
    let month = date.getMonth() + 1

    if (currentDateOfFirstDayOfWeek > THURSDAY_NUMBER) {
      if (weekOfMonth === 1) {
        month = prevDate.getMonth() + 1
        weekOfMonth = getWeekOfMonth(prevLastDate)
      } else {
        weekOfMonth -= 1
      }
    }

    setScreenMonth(month)
    setScreenWeek(weekOfMonth)
  }, [date])

  const getWeekOfMonth = (value: Date) => {
    const dateOfFirstDate = setDate(value, 1)
    const dateOfFirstDayOfWeek = dateOfFirstDate.getDay()

    const weekNumber = Math.ceil(
      (value.getDate() + (dateOfFirstDayOfWeek - 1)) / 7
    )

    return weekNumber
  }

  const handlePrev = () => {
    setCurrentDate(addDays(date, -7))
  }

  const handleNext = () => {
    setCurrentDate(addDays(date, 7))
  }

  return (
    <View style={weekControllerStyles.wrapper}>
      <View style={weekControllerStyles.container}>
        <Pressable onPress={handlePrev}>
          <Text>이전</Text>
        </Pressable>

        <Text>{`${screenMonth}월 ${screenWeek}주차`}</Text>

        <Pressable onPress={handleNext}>
          <Text>이후</Text>
        </Pressable>
      </View>

      <Pressable>
        <Text>달력</Text>
      </Pressable>
    </View>
  )
}

const weekControllerStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  text: {}
})

export default WeekController
