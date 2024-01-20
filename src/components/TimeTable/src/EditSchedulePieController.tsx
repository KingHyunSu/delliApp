import React from 'react'
import {StyleSheet, Platform, StatusBar, PanResponder} from 'react-native'
import Svg, {Circle} from 'react-native-svg'

import {polarToCartesian} from '../util'
import {getStatusBarHeight} from 'react-native-status-bar-height'
import {trigger} from 'react-native-haptic-feedback'

import {useRecoilValue, useSetRecoilState} from 'recoil'
import {homeHeaderHeightState} from '@/store/system'
import {startDisableScheduleListState, endDisableScheduleListState} from '@/store/schedule'

interface Props {
  data: Schedule
  scheduleList: Schedule[]
  x: number
  y: number
  radius: number
  onChangeSchedule: Function
}

const EditSchedulePieController = ({data, scheduleList, x, y, radius, onChangeSchedule}: Props) => {
  const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight || 0

  const homeHeaderHeight = useRecoilValue(homeHeaderHeightState)
  const setStartDisableScheduleList = useSetRecoilState(startDisableScheduleListState)
  const setEndDisableScheduleList = useSetRecoilState(endDisableScheduleListState)

  const startAngle = React.useMemo(() => {
    return data.start_time * 0.25
  }, [data.start_time])

  const endAngle = React.useMemo(() => {
    return data.end_time * 0.25
  }, [data.end_time])

  const dragStartBtnCoordinate = polarToCartesian(x, y, radius, startAngle)
  const dragEndBtnCoordinate = polarToCartesian(x, y, radius, endAngle)

  React.useEffect(() => {
    trigger('soft', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })
  }, [startAngle, endAngle])

  React.useEffect(() => {
    let startTime = data.start_time
    let endTime = data.end_time

    if (endTime < startTime) {
      endTime += 60 * 24
    }

    const disableScheduleList = scheduleList.filter(item => {
      const start_time = item.start_time
      let end_time = item.end_time

      if (end_time === 0) {
        end_time = 60 * 24
      }

      const isOverlapAll =
        start_time >= startTime && start_time < endTime && end_time <= endTime && end_time > startTime
      const isOverlapCenter =
        start_time < startTime && end_time > endTime && start_time < endTime && end_time > startTime
      const isOverlapRight = startTime > start_time && end_time > startTime

      return isOverlapAll || isOverlapRight || isOverlapCenter
    })

    setStartDisableScheduleList(disableScheduleList)
  }, [startAngle])

  React.useEffect(() => {
    const startTime = data.start_time
    let endTime = data.end_time

    const disableScheduleList = scheduleList.filter(item => {
      const start_time = item.start_time
      let end_time = item.end_time

      if (end_time === 0) {
        end_time = 60 * 24
      }

      const isOverlapAll =
        start_time >= startTime && start_time < endTime && end_time <= endTime && end_time > startTime
      const isOverlapCenter =
        start_time < startTime && end_time > endTime && start_time < endTime && end_time > startTime
      const isOverlapLeft = endTime > start_time && end_time > endTime

      return isOverlapAll || isOverlapLeft || isOverlapCenter
    })

    setEndDisableScheduleList(disableScheduleList)
  }, [endAngle])

  const getCalcTotalMinute = (angle: number) => {
    const MINUTE_INTERVAL = 5

    const totalMinute = angle / 0.25
    const minuteInterval = Math.round(totalMinute / MINUTE_INTERVAL) * MINUTE_INTERVAL

    const hour = Math.floor(minuteInterval / 60)
    const minute = Math.floor(minuteInterval % 60)

    return hour * 60 + minute
  }

  const startPanResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + (homeHeaderHeight + statusBarHeight - 100))
        const moveX = gestureState.moveX - x

        let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

        if (angle < 0) {
          angle += 360
        }

        const calcTotalMinute = getCalcTotalMinute(angle)

        onChangeSchedule({start_time: calcTotalMinute})
      }
    })
  ).current

  const endPanResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + homeHeaderHeight + statusBarHeight - 100)
        const moveX = gestureState.moveX - x

        let move = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

        const moveAngle = move - endAngle
        let angle = endAngle + moveAngle

        if (angle < 0) {
          angle += 360
        }
        const calcTotalMinute = getCalcTotalMinute(angle)

        onChangeSchedule({end_time: calcTotalMinute})
      }
    })
  ).current

  return (
    <>
      <Svg style={styles.item}>
        <Circle cx={dragStartBtnCoordinate.x} cy={dragStartBtnCoordinate.y} r={10} fill="#1E90FF" />
        <Circle
          {...startPanResponders.panHandlers}
          cx={dragStartBtnCoordinate.x}
          cy={dragStartBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        />
      </Svg>

      <Svg style={styles.item}>
        <Circle cx={dragEndBtnCoordinate.x} cy={dragEndBtnCoordinate.y} r={10} fill="#1E90FF" />
        <Circle
          {...endPanResponders.panHandlers}
          cx={dragEndBtnCoordinate.x}
          cy={dragEndBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        />
      </Svg>
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    position: 'absolute'
  }
})

export default EditSchedulePieController
