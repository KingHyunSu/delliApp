import React from 'react'
import {View} from 'react-native'

import WeekController from './src/WeekController'
import DayPicker from './src/DayPicker'

const WeeklyDatePicker = () => {
  const [date, setDate] = React.useState(new Date())

  return (
    <View>
      <WeekController date={date} setDate={setDate} />
      <DayPicker date={date} setDate={setDate} />
    </View>
  )
}

export default WeeklyDatePicker
