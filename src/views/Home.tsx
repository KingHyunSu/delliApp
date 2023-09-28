import React from 'react'
import {StyleSheet, Animated, View, Pressable} from 'react-native'

import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import TimeTable from '@/components/TimeTable'
import ScheduleListBottomSheet from '@/views/BottomSheet/ScheduleListBottomSheet'
import InsertScheduleBottomSheet from '@/views/BottomSheet/InsertScheduleBottomSheet'
import LoginBottomSheet from '@/views/BottomSheet/LoginBottomSheet'

import {useRecoilValue, useResetRecoilState} from 'recoil'
import {isLoginState} from '@/store/user'
import {scheduleState} from '@/store/schedule'

const Home = () => {
  const isLogin = useRecoilValue(isLoginState)
  const resetScheduleEdit = useResetRecoilState(scheduleState)
  const [isInsertMode, changeInsertMode] = React.useState(false)
  const [isShowLoginBottomSheet, setShowLoginBottomSheet] =
    React.useState(false)

  const handleLoginBottomSheetChanges = () => {
    changeInsertMode(false)
    setShowLoginBottomSheet(false)
  }

  const showInsertBottomSheet = () => {
    if (!isLogin) {
      setShowLoginBottomSheet(true)
    } else {
      changeInsertMode(true)
    }
  }

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
    if (!isLogin) {
      return
    }

    if (isInsertMode) {
      translateAnimation(weeklyDatePickerTranslateY, -200, 350)
      translateAnimation(timaTableTranslateY, -100)
    } else {
      resetScheduleEdit()

      translateAnimation(weeklyDatePickerTranslateY, 0, 350)
      translateAnimation(timaTableTranslateY, 0)
    }
  }, [
    isLogin,
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
            isInsertMode={isInsertMode && isLogin}
            onClick={showInsertBottomSheet}
          />
        </Pressable>
      </Animated.View>

      {isInsertMode ? (
        <InsertScheduleBottomSheet />
      ) : (
        <ScheduleListBottomSheet />
      )}
      {!isLogin && (
        <LoginBottomSheet
          isShow={isShowLoginBottomSheet}
          onClose={handleLoginBottomSheetChanges}
        />
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
    paddingHorizontal: 16
  }
})

export default Home
