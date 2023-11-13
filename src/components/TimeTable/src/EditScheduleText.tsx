import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import {polarToCartesian} from '../util'

import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
  onChangeSchedule: Function
}
const EditScheduleText = ({data, centerX, centerY, radius, onChangeSchedule}: Props) => {
  const containerPadding = 20
  const wrapperPadding = 5

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

  const changeSchedule = (data: Object) => {
    onChangeSchedule(data)
  }

  const containerX = useSharedValue(0)
  const containerY = useSharedValue(0)

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
      const borderWidth = 1
      const padding = containerPadding + wrapperPadding + borderWidth

      changedY = Math.round(centerY - padding - (radius / 100) * data.title_y)
      changedX = Math.round(centerX - padding + (radius / 100) * data.title_x)
    }

    setLeft(changedX)
    setTop(changedY)

    containerX.value = changedX
    containerY.value = changedY
  }, [])

  if (!top && !left) {
    return <></>
  }

  return (
    <GestureDetector gesture={composeGesture}>
      <Animated.View style={[animationStyle, styles.conatiner, {padding: containerPadding}]}>
        <View style={[styles.wrapper, {padding: wrapperPadding}]}>
          <Text style={styles.text}>{data.title}</Text>
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
  text: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 14,
    color: '#000'
  }
})

export default EditScheduleText
