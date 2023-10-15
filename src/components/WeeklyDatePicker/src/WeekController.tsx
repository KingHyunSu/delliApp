import React from 'react'
import {useWindowDimensions, StyleSheet, View, Text, Pressable} from 'react-native'
import DatePickerBottomSheet from '@/views/BottomSheet/DatePickerBottomSheet'

import {addDays, addMonths, setDate, lastDayOfMonth, format} from 'date-fns'

import {useSetRecoilState} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

interface Props {
  date: Date
  onChange: Function
}
const WeekController = ({date, onChange}: Props) => {
  const {height} = useWindowDimensions()
  const THURSDAY_NUMBER = 4

  const setScheduleDate = useSetRecoilState(scheduleDateState)

  const [showDatePickerBottomSheet, setDatePickerBottomSheet] = React.useState(false)
  const screenDateStr = React.useMemo(() => format(date, 'yyyy-MM-dd'), [date])
  const screenYear = React.useMemo(() => date.getFullYear(), [date])
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

    const weekNumber = Math.ceil((value.getDate() + (dateOfFirstDayOfWeek - 1)) / 7)

    return weekNumber
  }

  const changeDate = (data: string) => {
    setScheduleDate(new Date(data))
  }

  const handlePrev = () => {
    onChange(addDays(date, -7))
  }

  const handleNext = () => {
    onChange(addDays(date, 7))
  }

  return (
    <View style={[styles.wrapper, {marginBottom: height * 0.0177}]}>
      <View style={styles.container}>
        {/* <Pressable style={styles.controlButton} onPress={handlePrev}>
          <LeftArrowIcon width={16} />
        </Pressable> */}

        <Pressable onPress={() => setDatePickerBottomSheet(true)}>
          <Text style={styles.text}>{`${screenYear}년 ${screenMonth}월 ${screenWeek}주차`}</Text>
        </Pressable>

        {/* <Pressable style={styles.controlButton} onPress={handleNext}>
          <RightArrowIcon width={16} />
        </Pressable> */}
      </View>

      <DatePickerBottomSheet
        value={screenDateStr}
        isShow={showDatePickerBottomSheet}
        onClose={() => setDatePickerBottomSheet(false)}
        onChange={changeDate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  text: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 16
  },
  controlButton: {}
})

export default WeekController
