import React from 'react'
import {StyleSheet} from 'react-native'
import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction
} from 'react-native-reanimated'
import Svg, {Circle} from 'react-native-svg'
import {trigger} from 'react-native-haptic-feedback'

import {useRecoilValue} from 'recoil'
import {homeHeaderHeightState} from '@/store/system'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
  onScheduleChanged: Function
}

const MINUTE_INTERVAL = 10
const itemSize = 38

const EditSchedulePieController = ({data, x, y, radius, onScheduleChanged}: Props) => {
  const homeHeaderHeight = useRecoilValue(homeHeaderHeightState)

  const newStartTime = useSharedValue(data.start_time)
  const newEndTime = useSharedValue(data.end_time)

  const startAnchorPosition = useDerivedValue(() => {
    const angle = newStartTime.value * 0.25
    const angleInRadians = ((angle - 90) * Math.PI) / 180.0

    return {
      x: x + radius * Math.cos(angleInRadians) - itemSize / 2,
      y: y + radius * Math.sin(angleInRadians) - itemSize / 2
    }
  })

  const endAnchorPosition = useDerivedValue(() => {
    const angle = newEndTime.value * 0.25
    const angleInRadians = ((angle - 90) * Math.PI) / 180.0

    return {
      x: x + radius * Math.cos(angleInRadians) - itemSize / 2,
      y: y + radius * Math.sin(angleInRadians) - itemSize / 2
    }
  })

  const startAnchorAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: startAnchorPosition.value.y,
      left: startAnchorPosition.value.x
    }
  })

  const endAnchorAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: endAnchorPosition.value.y,
      left: endAnchorPosition.value.x
    }
  })

  // styles
  const startAnchorStyle = React.useMemo(() => {
    return [styles.item, startAnchorAnimatedStyle]
  }, [])

  const endAnchorStyle = React.useMemo(() => {
    return [styles.item, endAnchorAnimatedStyle]
  }, [])

  const getCalcTotalMinute = React.useCallback((angle: number) => {
    const totalMinute = angle / 0.25

    if (totalMinute % 10 < 3) {
      const minuteInterval = Math.round(totalMinute / MINUTE_INTERVAL) * MINUTE_INTERVAL
      const hour = Math.floor(minuteInterval / 60)
      const minute = Math.floor(minuteInterval % 60)

      return hour * 60 + minute
    }

    return null
  }, [])

  const startGesture = Gesture.Pan()
    .onUpdate(event => {
      const moveY = event.absoluteY - (y + homeHeaderHeight)
      const moveX = event.absoluteX - x

      let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90
      if (angle < 0) angle += 360

      const calcTotalMinute = getCalcTotalMinute(angle)

      if (calcTotalMinute) {
        newStartTime.value = calcTotalMinute
        onScheduleChanged({start_time: calcTotalMinute})
      }
    })
    .runOnJS(true)

  const endGesture = Gesture.Pan()
    .onUpdate(event => {
      const moveY = event.absoluteY - (y + homeHeaderHeight)
      const moveX = event.absoluteX - x

      let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90
      if (angle < 0) angle += 360

      const calcTotalMinute = getCalcTotalMinute(angle)

      if (calcTotalMinute) {
        newEndTime.value = calcTotalMinute
        onScheduleChanged({end_time: calcTotalMinute})
      }
    })
    .runOnJS(true)

  // trigger
  useAnimatedReaction(
    () => {
      return newStartTime.value
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(trigger)('soft', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false
        })
      }
    }
  )

  useAnimatedReaction(
    () => {
      return newEndTime.value
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(trigger)('soft', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false
        })
      }
    }
  )

  return (
    <>
      <GestureDetector gesture={startGesture}>
        <Animated.View style={startAnchorStyle}>
          <Svg>
            <Circle cx={itemSize / 2} cy={itemSize / 2} r={10} fill="#1E90FF" />
          </Svg>
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={endGesture}>
        <Animated.View style={endAnchorStyle}>
          <Svg>
            <Circle cx={itemSize / 2} cy={itemSize / 2} r={10} fill="#1E90FF" />
          </Svg>
        </Animated.View>
      </GestureDetector>
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
    width: itemSize,
    height: itemSize,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default EditSchedulePieController
