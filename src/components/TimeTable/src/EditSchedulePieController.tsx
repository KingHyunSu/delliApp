import React from 'react'
import {StyleSheet, Platform, StatusBar, PanResponder, View} from 'react-native'
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
const itemSize = 38

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

  const startItemStyle = React.useMemo(() => {
    return [styles.item, {left: dragStartBtnCoordinate.x - itemSize / 2, top: dragStartBtnCoordinate.y - itemSize / 2}]
  }, [dragStartBtnCoordinate.x, dragStartBtnCoordinate.y])

  const endItemStyle = React.useMemo(() => {
    return [styles.item, {left: dragEndBtnCoordinate.x - itemSize / 2, top: dragEndBtnCoordinate.y - itemSize / 2}]
  }, [dragEndBtnCoordinate.x, dragEndBtnCoordinate.y])

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

  React.useEffect(() => {
    trigger('soft', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })
  }, [startAngle, endAngle])

  return (
    <>
      <View {...startPanResponders.panHandlers} style={startItemStyle}>
        <Svg>
          <Circle cx={itemSize / 2} cy={itemSize / 2} r={10} fill="#1E90FF" />
        </Svg>
      </View>

      <View {...endPanResponders.panHandlers} style={endItemStyle}>
        <Svg>
          <Circle cx={itemSize / 2} cy={itemSize / 2} r={10} fill="#1E90FF" />
        </Svg>
      </View>
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
