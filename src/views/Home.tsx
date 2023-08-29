import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import TimeTable from '@/components/TimeTable'
import ScheduleListBottomSheet from '@/components/ScheduleListBottomSheet'
import InsertScheduleBottomSheet from '@/components/InsertScheduleBottomSheet'

const Home = () => {
  const [isInsertMode, changeInsertMode] = React.useState(false)

  return (
    <View style={homeStyles.container}>
      <View
        // [todo] status bar
        style={{paddingHorizontal: 16, height: 48, justifyContent: 'center'}}>
        <Text>Home</Text>
      </View>

      <View style={homeStyles.weekDatePickerSection}>
        <WeeklyDatePicker />
      </View>

      <Pressable onPress={() => changeInsertMode(false)}>
        <TimeTable onClick={() => changeInsertMode(true)} />
      </Pressable>

      {isInsertMode ? (
        <InsertScheduleBottomSheet />
      ) : (
        <ScheduleListBottomSheet />
      )}
    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  weekDatePickerSection: {
    // marginVertical: 20,
    paddingHorizontal: 16
  }
})

export default Home
