import React from 'react'
import { View } from 'react-native'

import WeekController from './src/WeekController'
import DayPicker from './src/DayPicker'

import { useRecoilState } from 'recoil'
import { scheduleDateState } from '@/store/schedule'

import { getWeeklyDateList } from './util'

const WeeklyDatePicker = () => {
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)

  const currentWeeklyDateList = React.useMemo(() => {
    return getWeeklyDateList(scheduleDate)
  }, [scheduleDate])

  return (
    <View>
      <WeekController date={scheduleDate} currentWeeklyDateList={currentWeeklyDateList} onChange={setScheduleDate} />
      <DayPicker date={scheduleDate} currentWeeklyDateList={currentWeeklyDateList} onChange={setScheduleDate} />
    </View>
  )
}

export default WeeklyDatePicker
