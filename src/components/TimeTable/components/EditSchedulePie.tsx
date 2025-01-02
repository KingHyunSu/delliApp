import {useMemo, useCallback, useEffect, useLayoutEffect} from 'react'
import {StyleSheet} from 'react-native'
import Svg, {Circle} from 'react-native-svg'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useAnimatedStyle, useDerivedValue} from 'react-native-reanimated'
import {trigger} from 'react-native-haptic-feedback'

import SchedulePie from './SchedulePie'

import {useRecoilState, useRecoilValue} from 'recoil'
import {homeHeaderHeight} from '@/store/system'
import {showColorSelectorBottomSheetState} from '@/store/bottomSheet'
import {editScheduleTimeState} from '@/store/schedule'

interface Props {
  data: EditScheduleForm
  scheduleList: Schedule[]
  centerX: number
  centerY: number
  radius: number
  color: string | null
  isInputMode: Boolean
  onChangeSchedule: Function
  onChangeScheduleDisabled: (value: ExistSchedule[]) => void
}

const MINUTE_INTERVAL = 10
const itemSize = 48
const EditSchedulePie = ({
  data,
  scheduleList,
  centerX,
  centerY,
  radius,
  color,
  isInputMode,
  onChangeSchedule,
  onChangeScheduleDisabled
}: Props) => {
  const [editScheduleTime, setEditScheduleTime] = useRecoilState(editScheduleTimeState)

  const showColorSelectorBottomSheet = useRecoilValue(showColorSelectorBottomSheetState)

  const startAnchorPosition = useDerivedValue(() => {
    const angle = editScheduleTime.start * 0.25
    const angleInRadians = ((angle - 90) * Math.PI) / 180.0

    return {
      x: centerX + radius * Math.cos(angleInRadians) - itemSize / 2,
      y: centerY + radius * Math.sin(angleInRadians) - itemSize / 2
    }
  })

  const endAnchorPosition = useDerivedValue(() => {
    const angle = editScheduleTime.end * 0.25
    const angleInRadians = ((angle - 90) * Math.PI) / 180.0

    return {
      x: centerX + radius * Math.cos(angleInRadians) - itemSize / 2,
      y: centerY + radius * Math.sin(angleInRadians) - itemSize / 2
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

  const startAnchorStyle = useMemo(() => {
    return [styles.anchor, startAnchorAnimatedStyle]
  }, [])

  const endAnchorStyle = useMemo(() => {
    return [styles.anchor, endAnchorAnimatedStyle]
  }, [])

  const isShowAnchor = useMemo(() => {
    return !isInputMode && !showColorSelectorBottomSheet
  }, [isInputMode, showColorSelectorBottomSheet])
  /**
   * style end
   */

  const getCalcTotalMinute = useCallback((angle: number) => {
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
      const moveY = event.absoluteY - (centerY + homeHeaderHeight)
      const moveX = event.absoluteX - centerX

      let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90
      if (angle < 0) angle += 360

      const calcTotalMinute = getCalcTotalMinute(angle)

      if (calcTotalMinute !== null) {
        setEditScheduleTime(prevState => ({
          ...prevState,
          start: calcTotalMinute
        }))
      }
    })
    .onEnd(() => {
      onChangeSchedule({start_time: editScheduleTime.start})
    })
    .runOnJS(true)

  const endGesture = Gesture.Pan()
    .onUpdate(event => {
      const moveY = event.absoluteY - (centerY + homeHeaderHeight)
      const moveX = event.absoluteX - centerX

      let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90
      if (angle < 0) angle += 360

      const calcTotalMinute = getCalcTotalMinute(angle)

      if (calcTotalMinute !== null) {
        setEditScheduleTime(prevState => ({
          ...prevState,
          end: calcTotalMinute
        }))
      }
    })
    .onEnd(() => {
      onChangeSchedule({end_time: editScheduleTime.end})
    })
    .runOnJS(true)
  /**
   * gesture event end
   */

  useEffect(() => {
    trigger('soft', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })
  }, [editScheduleTime.start, editScheduleTime.end])

  useLayoutEffect(() => {
    const pStartTime = editScheduleTime.start
    const pEndTime = editScheduleTime.end

    const result = scheduleList.filter(item => {
      if (data.schedule_id === item.schedule_id) {
        return false
      }

      const sStartTime = item.start_time
      const sEndTime = item.end_time

      if (pStartTime > pEndTime) {
        if (sStartTime <= pStartTime && sEndTime <= pEndTime) {
          return true
        }
      }

      if (sStartTime > sEndTime) {
        if (sStartTime < pStartTime || sEndTime > pStartTime || sStartTime < pEndTime || sEndTime > pEndTime) {
          return true
        }

        if (pStartTime > pEndTime) {
          if (sStartTime >= pStartTime && sEndTime <= pEndTime) {
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

    onChangeScheduleDisabled(result as ExistSchedule[])
  }, [data.schedule_id, editScheduleTime.start, editScheduleTime.end, scheduleList, onChangeScheduleDisabled])

  return (
    <>
      <Svg>
        <SchedulePie
          data={data}
          x={centerX}
          y={centerY}
          radius={radius}
          startTime={editScheduleTime.start}
          endTime={editScheduleTime.end}
          color={color}
        />
      </Svg>

      {isShowAnchor && (
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
