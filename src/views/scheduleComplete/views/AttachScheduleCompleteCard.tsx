import React, {useEffect, useMemo} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import AppBar from '@/components/AppBar'
import {useRecoilValue} from 'recoil'
import {activeBackgroundState, editTimetableTranslateYState} from '@/store/system'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import {Timetable} from '@/components/TimeTable'
import {scheduleListState} from '@/store/schedule'

const AttachScheduleCompleteCard = () => {
  const scheduleList = useRecoilValue(scheduleListState)
  const editTimetableTranslateY = useRecoilValue(editTimetableTranslateYState)
  const activeBackground = useRecoilValue(activeBackgroundState)

  const timetableTranslateY = useSharedValue(0)

  const timetableAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: timetableTranslateY.value}]
  }))

  useEffect(() => {
    timetableTranslateY.value = withTiming(-editTimetableTranslateY)

    return () => {
      timetableTranslateY.value = 0
    }
  }, [])

  const backgroundComponent = useMemo(() => {
    if (!activeBackground || activeBackground.background_id === 1) {
      return <Image style={styles.backgroundImage} source={require('@/assets/beige.png')} />
    }

    return <Image style={styles.backgroundImage} source={{uri: activeBackground.main_url}} />
  }, [activeBackground])

  return (
    <View style={[styles.container, {backgroundColor: activeBackground.background_color}]}>
      <AppBar backPress color="transparent" />

      <View style={{height: 36}} />

      <Animated.View style={timetableAnimatedStyle}>
        {backgroundComponent}
        <Timetable data={scheduleList} />
      </Animated.View>
      {/*<Timetable data={scheduleList} />*/}

      {/*<View style={styles.wrapper}>*/}
      {/*  <Text>AttachScheduleCompleteCard</Text>*/}
      {/*</View>*/}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

export default AttachScheduleCompleteCard
