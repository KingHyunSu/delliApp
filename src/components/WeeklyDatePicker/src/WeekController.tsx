import React from 'react'
import {useWindowDimensions, StyleSheet, View, Text, Pressable} from 'react-native'
import DatePickerBottomSheet from '@/views/BottomSheet/DatePickerBottomSheet'

import {setDate, format} from 'date-fns'

import {useSetRecoilState} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

interface Props {
  date: Date
  currentWeeklyDateList: Date[]
}
const WeekController = ({date, currentWeeklyDateList}: Props) => {
  const {height} = useWindowDimensions()
  const THURSDAY_NUMBER = 4

  const setScheduleDate = useSetRecoilState(scheduleDateState)

  const [showDatePickerBottomSheet, setDatePickerBottomSheet] = React.useState(false)
  const screenDateStr = React.useMemo(() => format(date, 'yyyy-MM-dd'), [date])
  const screenYear = React.useMemo(() => date.getFullYear(), [date])
  const [screenMonth, setScreenMonth] = React.useState(date.getMonth() + 1)
  const [screenWeek, setScreenWeek] = React.useState(0)

  const getWeekOfMonth = (value: Date) => {
    const dateOfFirstDate = setDate(value, 1)
    const dateOfFirstDayOfWeek = dateOfFirstDate.getDay()

    const weekNumber = Math.ceil((value.getDate() + (dateOfFirstDayOfWeek - 1)) / 7)

    return weekNumber
  }

  const changeDate = (data: string) => {
    setScheduleDate(new Date(data))
  }

  React.useEffect(() => {
    const firstDate = currentWeeklyDateList.find(item => {
      return item.getDate() === 1
    })

    let month = date.getMonth() + 1
    let weekOfMonth = getWeekOfMonth(date)

    if (firstDate) {
      const thursdayDate = currentWeeklyDateList.find(item => {
        return item.getDay() === THURSDAY_NUMBER
      })

      if (thursdayDate) {
        month = thursdayDate.getMonth() + 1
        weekOfMonth = getWeekOfMonth(thursdayDate)
      }
    }

    setScreenMonth(month)
    setScreenWeek(weekOfMonth)
  }, [date, currentWeeklyDateList])

  return (
    <View style={[styles.wrapper, {marginBottom: height * 0.0177}]}>
      <Pressable onPress={() => setDatePickerBottomSheet(true)}>
        <Text style={styles.text}>{`${screenYear}년 ${screenMonth}월 ${screenWeek}주차`}</Text>
      </Pressable>

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
  text: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 16,
    color: '#000'
  }
})

export default WeekController
