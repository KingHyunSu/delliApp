import React from 'react'
import {StyleSheet, View, TextInput} from 'react-native'

import {polarToCartesian} from '../util'

import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

import {useRecoilValue} from 'recoil'
import {scheduleState} from '@/store/schedule'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
  titleInputRef: React.RefObject<TextInput>
  onChangeSchedule: Function
}
const EditScheduleText = ({data, centerX, centerY, radius, titleInputRef, onChangeSchedule}: Props) => {
  const containerPadding = 20
  const wrapperPadding = 5
  const borderWidth = 1

  const schedule = useRecoilValue(scheduleState)

  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  const angle = React.useMemo(() => {
    const startAngle = data.start_time * 0.25
    let endAngle = data.end_time * 0.25

    if (endAngle < startAngle) {
      endAngle += 360
    }

    return startAngle + (endAngle - startAngle) / 2
  }, [data.start_time, data.end_time])

  const changeSchedule = (value: Object) => {
    onChangeSchedule(value)
  }

  const changeTitle = (value: string) => {
    changeSchedule({title: value})
  }

  const containerX = useSharedValue(
    Math.round(centerX - (containerPadding + wrapperPadding + borderWidth) + (radius / 100) * data.title_x)
  )
  const containerY = useSharedValue(
    Math.round(centerY - (containerPadding + wrapperPadding + borderWidth) - (radius / 100) * data.title_y)
  )

  const containerRotate = useSharedValue(data.title_rotate)
  const conatinerSavedRotate = useSharedValue(0)

  const moveGesture = Gesture.Pan()
    .enableTrackpadTwoFingerGesture(true)
    .onUpdate(e => {
      containerX.value = Math.round(left + e.translationX)
      containerY.value = Math.round(top + e.translationY)
    })
    .onEnd(() => {
      const changedX = containerX.value
      const changedY = containerY.value

      const padding = containerPadding + wrapperPadding
      const xPercentage = Math.round(((changedX + padding - centerX) / radius) * 100)
      const yPercentage = Math.round((((changedY + padding - centerY) * -1) / radius) * 100)

      runOnJS(setLeft)(changedX)
      runOnJS(setTop)(changedY)

      runOnJS(changeSchedule)({title_x: xPercentage, title_y: yPercentage})
    })

  const rotateGesture = Gesture.Rotation()
    .onUpdate(e => {
      containerRotate.value = conatinerSavedRotate.value + (e.rotation / Math.PI) * 180
    })
    .onEnd(e => {
      const chagnedRotate = (e.rotation / Math.PI) * 180

      conatinerSavedRotate.value = chagnedRotate

      runOnJS(changeSchedule)({title_rotate: chagnedRotate})
    })

  const composeGesture = Gesture.Simultaneous(moveGesture, rotateGesture)

  const animationStyle = useAnimatedStyle(() => {
    return {
      top: containerY.value,
      left: containerX.value,
      transform: [{rotateZ: `${containerRotate.value}deg`}]
    }
  })

  React.useEffect(() => {
    const {x, y} = polarToCartesian(centerX, centerY - 13, radius / 3, angle)

    let changedY = Math.round(y)
    let changedX = Math.round(x)

    if (data.schedule_id) {
      changedY = Math.round(centerY - (containerPadding + wrapperPadding + borderWidth) - (radius / 100) * data.title_y)
      changedX = Math.round(centerX - (containerPadding + wrapperPadding + borderWidth) + (radius / 100) * data.title_x)
    }

    setLeft(changedX)
    setTop(changedY)
  }, [])

  return (
    <GestureDetector gesture={composeGesture}>
      <Animated.View style={[animationStyle, styles.conatiner, {padding: containerPadding}]}>
        <View style={[styles.wrapper, !schedule.title && {borderWidth: 0}, {padding: wrapperPadding}]}>
          <TextInput
            ref={titleInputRef}
            value={data.title}
            style={[styles.textInput, {color: data.text_color}]}
            multiline
            scrollEnabled={false}
            onChangeText={changeTitle}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    position: 'absolute'
  },
  wrapper: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BABABA'
  },
  textInput: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 14,
    color: '#000',
    paddingVertical: 0
  }
})

export default EditScheduleText
