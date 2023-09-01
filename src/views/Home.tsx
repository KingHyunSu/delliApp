import React from 'react'
import {StyleSheet, Animated, View, Text, Pressable} from 'react-native'

import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import TimeTable from '@/components/TimeTable'
import ScheduleListBottomSheet from '@/components/ScheduleListBottomSheet'
import InsertScheduleBottomSheet from '@/components/InsertScheduleBottomSheet'

import {useResetRecoilState} from 'recoil'
import {scheduleState} from '@/store/schedule'
const Home = () => {
  const resetScheduleEdit = useResetRecoilState(scheduleState)
  const [isInsertMode, changeInsertMode] = React.useState(false)

  const weeklyDatePickerTranslateY = React.useRef(new Animated.Value(0)).current
  const timaTableTranslateY = React.useRef(new Animated.Value(0)).current

  const translateAnimation = (
    target: Animated.Value,
    to: number,
    duration?: number
  ) => {
    Animated.timing(target, {
      toValue: to,
      duration: duration ? duration : 300,
      useNativeDriver: true
    }).start()
  }
  React.useEffect(() => {
    if (isInsertMode) {
      translateAnimation(weeklyDatePickerTranslateY, -200, 350)
      translateAnimation(timaTableTranslateY, -100)
    } else {
      resetScheduleEdit()

      translateAnimation(weeklyDatePickerTranslateY, 0, 350)
      translateAnimation(timaTableTranslateY, 0)
    }
  }, [
    isInsertMode,
    weeklyDatePickerTranslateY,
    timaTableTranslateY,
    resetScheduleEdit
  ])

  return (
    <View style={homeStyles.container}>
      <View
        // [todo] app bar
        style={{
          paddingHorizontal: 16,
          height: 48,
          justifyContent: 'center'
        }}
      />

      <Animated.View
        style={[
          homeStyles.weekDatePickerSection,
          {transform: [{translateY: weeklyDatePickerTranslateY}]}
        ]}>
        <WeeklyDatePicker />
      </Animated.View>

      <Animated.View style={[{transform: [{translateY: timaTableTranslateY}]}]}>
        <Pressable onPress={() => changeInsertMode(false)}>
          <TimeTable
            isInsertMode={isInsertMode}
            onClick={() => changeInsertMode(true)}
          />
        </Pressable>
      </Animated.View>

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
