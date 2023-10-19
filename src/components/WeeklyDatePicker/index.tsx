import React from 'react'
import {View} from 'react-native'

import WeekController from './src/WeekController'
import DayPicker from './src/DayPicker'

import {useRecoilState} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

import {addDays, eachDayOfInterval} from 'date-fns'

const WeeklyDatePicker = () => {
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)

  const weeklyDateList = React.useMemo(() => {
    const dayOfWeekIndex = scheduleDate.getDay() === 0 ? 6 : scheduleDate.getDay() - 1

    const startDate = addDays(scheduleDate, -dayOfWeekIndex)
    const endDate = addDays(scheduleDate, 6 - dayOfWeekIndex)

    return eachDayOfInterval({start: startDate, end: endDate})
  }, [scheduleDate])

  return (
    <View>
      <WeekController date={scheduleDate} weeklyDateList={weeklyDateList} onChange={setScheduleDate} />
      <DayPicker date={scheduleDate} weeklyDateList={weeklyDateList} onChange={setScheduleDate} />
    </View>
  )
}

export default WeeklyDatePicker
