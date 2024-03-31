import React from 'react'
import {StyleSheet, Platform, StatusBar, PanResponder} from 'react-native'
import Svg, {Circle} from 'react-native-svg'

import {polarToCartesian} from '../util'
import {getStatusBarHeight} from 'react-native-status-bar-height'
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

const MINUTE_INTERVAL = 5

const EditSchedulePieController = ({data, x, y, radius, onScheduleChanged}: Props) => {
  const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight || 0

  const homeHeaderHeight = useRecoilValue(homeHeaderHeightState)

  const newStartTime = React.useRef(data.start_time)
  const newEndTime = React.useRef(data.end_time)

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

  // React.useEffect(() => {
  //   let startTime = data.start_time
  //   let endTime = data.end_time

  //   const disableScheduleList = scheduleList
  //     .filter(item => {
  //       if (data.schedule_id === item.schedule_id) {
  //         return false
  //       }

  //       let start_time = item.start_time
  //       let end_time = item.end_time

  //       if (start_time > end_time) {
  //         const isOverlapStart = startTime > start_time || startTime < end_time
  //         const isOverlapEnd = endTime > start_time || endTime < end_time
  //         const isOverlapAll = startTime > endTime && startTime <= start_time && endTime >= end_time

  //         return isOverlapStart || isOverlapEnd || isOverlapAll
  //       }

  //       const isOverlapStart = startTime > start_time && startTime < end_time
  //       const isOverlapEnd = endTime > start_time && endTime < end_time
  //       const isOverlapAll = start_time >= startTime && end_time <= endTime

  //       return isOverlapStart || isOverlapEnd || isOverlapAll
  //     })
  //     .map(item => {
  //       return {
  //         schedule_id: item.schedule_id,
  //         title: item.title,
  //         start_time: item.start_time,
  //         end_time: item.end_time,
  //         start_date: item.start_date,
  //         end_date: item.end_date,
  //         mon: item.mon,
  //         tue: item.tue,
  //         wed: item.wed,
  //         thu: item.thu,
  //         fri: item.fri,
  //         sat: item.sat,
  //         sun: item.sun
  //       }
  //     })

  //   setDisableScheduleList(disableScheduleList)
  // }, [data.schedule_id, data.start_time, data.end_time, scheduleList, setDisableScheduleList])

  const getCalcTotalMinute = (angle: number) => {
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

        let calcTotalMinute = getCalcTotalMinute(angle)

        if (calcTotalMinute === 1440) {
          calcTotalMinute = 0
        }

        if (newStartTime.current !== calcTotalMinute) {
          newStartTime.current = calcTotalMinute

          onScheduleChanged({start_time: calcTotalMinute})
        }
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

        let calcTotalMinute = getCalcTotalMinute(angle)

        if (calcTotalMinute === 1440) {
          calcTotalMinute = 0
        }

        if (newEndTime.current !== calcTotalMinute) {
          newEndTime.current = calcTotalMinute

          onScheduleChanged({end_time: calcTotalMinute})
        }
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
