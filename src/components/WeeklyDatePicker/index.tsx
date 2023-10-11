import React from 'react'
import {View} from 'react-native'

import WeekController from './src/WeekController'
import DayPicker from './src/DayPicker'

import {useRecoilState} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

const WeeklyDatePicker = () => {
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)

  return (
    <View>
      <WeekController date={scheduleDate} onChange={setScheduleDate} />
      <DayPicker date={scheduleDate} onChange={setScheduleDate} />
    </View>
  )
}

export default WeeklyDatePicker
