import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import TimeTable from '@/components/TimeTable'

const Home = () => {
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

      <View>
        <TimeTable />
      </View>
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
