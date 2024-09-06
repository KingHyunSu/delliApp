import React from 'react'
import {StyleSheet} from 'react-native'
import Svg, {Circle} from 'react-native-svg'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated'
import {trigger} from 'react-native-haptic-feedback'

import SchedulePie from './SchedulePie'

import {useRecoilValue} from 'recoil'
import {homeHeaderHeightState} from '@/store/system'

interface Props {
  data: Schedule
  scheduleList: Schedule[]
  x: number
  y: number
  radius: number
  isInputMode: Boolean
  onChangeSchedule: Function
  onChangeScheduleDisabled: (value: ExistSchedule[]) => void
  onChangeStartTime: (value: number) => void
  onChangeEndTime: (value: number) => void
}

const MINUTE_INTERVAL = 10
const itemSize = 48
const EditSchedulePie = ({
  data,
  scheduleList,
  x,
  y,
  radius,
  isInputMode,
  onChangeSchedule,
  onChangeScheduleDisabled,
  onChangeStartTime,
  onChangeEndTime
}: Props) => {
  const homeHeaderHeight = useRecoilValue(homeHeaderHeightState)

  const [newStartTimeState, setNewStartTimeState] = React.useState(-1)
  const [newEndTimeState, setNewEndTimeState] = React.useState(-1)

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

  /**
   * style start
   */
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

  const startAnchorStyle = React.useMemo(() => {
    return [styles.anchor, startAnchorAnimatedStyle]
  }, [])

  const endAnchorStyle = React.useMemo(() => {
    return [styles.anchor, endAnchorAnimatedStyle]
  }, [])
  /**
   * style end
   */

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

  /**
   * gesture event start
   */
  const startGesture = Gesture.Pan()
    .onUpdate(event => {
      const moveY = event.absoluteY - (y + homeHeaderHeight)
      const moveX = event.absoluteX - x

      let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90
      if (angle < 0) angle += 360

      const calcTotalMinute = getCalcTotalMinute(angle)

      if (calcTotalMinute !== null) {
        newStartTime.value = calcTotalMinute
      }
    })
    .onEnd(() => {
      onChangeSchedule({start_time: newStartTime.value})
    })
    .runOnJS(true)

  const endGesture = Gesture.Pan()
    .onUpdate(event => {
      const moveY = event.absoluteY - (y + homeHeaderHeight)
      const moveX = event.absoluteX - x

      let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90
      if (angle < 0) angle += 360

      const calcTotalMinute = getCalcTotalMinute(angle)

      if (calcTotalMinute !== null) {
        newEndTime.value = calcTotalMinute
      }
    })
    .onEnd(() => {
      onChangeSchedule({end_time: newEndTime.value})
    })
    .runOnJS(true)
  /**
   * gesture event end
   */

  useAnimatedReaction(
    () => {
      return newStartTime.value
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(setNewStartTimeState)(currentValue)
        runOnJS(onChangeStartTime)(currentValue)

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
        runOnJS(setNewEndTimeState)(currentValue)
        runOnJS(onChangeEndTime)(currentValue)

        runOnJS(trigger)('soft', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false
        })
      }
    }
  )

  React.useEffect(() => {
    newStartTime.value = data.start_time
    newEndTime.value = data.end_time
  }, [data.start_time, data.end_time])

  React.useLayoutEffect(() => {
    if (newStartTimeState === -1 || newEndTimeState === -1) {
      return
    }

    const pStartTime = newStartTimeState
    const pEndTime = newEndTimeState

    const result = scheduleList
      .filter(item => {
        if (data.schedule_id === item.schedule_id) {
          return false
        }

        const sStartTime = item.start_time
        const sEndTime = item.end_time

        if (sStartTime > sEndTime) {
          if (sStartTime < pStartTime || sEndTime > pStartTime || sStartTime < pEndTime || sEndTime > pEndTime) {
            return true
          }

          if (pStartTime > pEndTime) {
            if (sStartTime > pStartTime && sEndTime < pEndTime) {
              return true
            }
          }
        }

        // Case 2: start_time < end_time (does not span midnight)
        if (sStartTime < sEndTime) {
          if (
            (sStartTime < pStartTime && sEndTime > pStartTime) ||
            (sStartTime < pEndTime && sEndTime > pEndTime) ||
            (sStartTime >= pStartTime && sEndTime <= pEndTime)
          ) {
            return true
          }
        }

        return false
      })
      .map(item => {
        return {
          schedule_id: item.schedule_id,
          title: item.title,
          start_time: item.start_time,
          end_time: item.end_time,
          start_date: item.start_date,
          end_date: item.end_date,
          mon: item.mon,
          tue: item.tue,
          wed: item.wed,
          thu: item.thu,
          fri: item.fri,
          sat: item.sat,
          sun: item.sun
        }
      })

    onChangeScheduleDisabled(result as ExistSchedule[])
  }, [data.schedule_id, newStartTimeState, newEndTimeState, scheduleList, onChangeScheduleDisabled])

  return (
    <>
      <Svg>
        <SchedulePie data={data} x={x} y={y} radius={radius} startTime={newStartTimeState} endTime={newEndTimeState} />
      </Svg>

      {!isInputMode && (
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
      )}
    </>
  )
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    width: itemSize,
    height: itemSize,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
})

export default EditSchedulePie
