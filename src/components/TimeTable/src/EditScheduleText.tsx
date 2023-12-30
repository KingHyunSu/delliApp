import React from 'react'
import {StyleSheet, TextInput} from 'react-native'

import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

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
  const containerPadding = 50
  const borderWidth = 1

  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  const changeSchedule = (value: Object) => {
    onChangeSchedule(value)
  }

  const changeTitle = (value: string) => {
    changeSchedule({title: value})
  }

  const containerX = useSharedValue(
    Math.round(centerX - (containerPadding + borderWidth) + (radius / 100) * data.title_x)
  )
  const containerY = useSharedValue(
    Math.round(centerY - (containerPadding + borderWidth) - (radius / 100) * data.title_y)
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

      const xPercentage = Math.round(((changedX + containerPadding - centerX) / radius) * 100)
      const yPercentage = Math.round((((changedY + containerPadding - centerY) * -1) / radius) * 100)

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

  const positionStyle = useAnimatedStyle(() => {
    return {
      top: containerY.value,
      left: containerX.value
    }
  })

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${containerRotate.value}deg`}]
    }
  })

  React.useEffect(() => {
    setLeft(containerX.value)
    setTop(containerY.value)
  }, [])

  return (
    <GestureDetector gesture={composeGesture}>
      <Animated.View style={[positionStyle, rotateStyle, styles.conatiner, {padding: containerPadding}]}>
        <TextInput
          ref={titleInputRef}
          value={data.title}
          placeholder="일정명을 입력해주세요."
          returnKeyType="done"
          returnKeyLabel="done"
          placeholderTextColor="#c3c5cc"
          style={[styles.textInput, {color: data.text_color}]}
          maxLength={20}
          multiline
          scrollEnabled={false}
          onChangeText={changeTitle}
        />
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    position: 'absolute'
  },
  textInput: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000',
    paddingVertical: 0
  }
})

export default EditScheduleText
