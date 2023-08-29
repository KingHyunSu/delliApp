import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import WeeklyDatePicker from '@/components/WeeklyDatePicker'

const Home = () => {
  return (
    <View style={homeStyles.container}>
      <Text>Home</Text>

      <View style={homeStyles.weekDatePickerSection}>
        <WeeklyDatePicker />
      </View>
    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16
  },

  weekDatePickerSection: {
    marginVertical: 20
  }
})

export default Home
