import React from 'react'
import {Platform, StatusBar, PanResponder} from 'react-native'
import Svg, {G, Circle} from 'react-native-svg'

import {polarToCartesian} from '../util'
import {getStatusBarHeight} from 'react-native-status-bar-height'
import {trigger} from 'react-native-haptic-feedback'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {homeHeaderHeightState} from '@/store/system'
import {scheduleListState, editStartAngleState, editEndAngleState} from '@/store/schedule'

import {Schedule} from '@/types/schedule'

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
  const [editStartAngle, setEditStartAngle] = useRecoilState(editStartAngleState)
  const [editEndAngle, setEditEndAngle] = useRecoilState(editEndAngleState)
  const setScheduleList = useSetRecoilState(scheduleListState)

  const dragStartBtnCoordinate = polarToCartesian(x, y, radius, editStartAngle)
  const dragEndBtnCoordinate = polarToCartesian(x, y, radius, editEndAngle)

  React.useEffect(() => {
    trigger('soft', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })
  }, [editStartAngle, editEndAngle])

  React.useEffect(() => {
    const start_time = data.start_time
    const end_time = data.end_time

    const list = scheduleList.map(item => {
      const isOverlapAll =
        item.start_time >= start_time &&
        item.start_time < end_time &&
        item.end_time <= end_time &&
        item.end_time > start_time

      const isOverlapLeft = item.start_time >= start_time && item.end_time > end_time && item.start_time < end_time

      const isOverlapRight = item.start_time < start_time && item.end_time <= end_time && item.end_time > start_time

      const isOverlapCenter =
        item.start_time < start_time &&
        item.end_time > end_time &&
        item.start_time < end_time &&
        item.end_time > start_time

      if (isOverlapAll || isOverlapLeft || isOverlapRight || isOverlapCenter) {
        return {...item, disable: '1'}
      }

      return {...item, disable: '0'}
    })

    setScheduleList(list)
  }, [data.start_time, data.end_time])

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

        setEditStartAngle(calcTotalMinute * 0.25)
      },
      onPanResponderRelease: (event, gestureState) => {
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
        console.log('statusBarHeight', statusBarHeight)
        const moveY = gestureState.moveY - (y + homeHeaderHeight + statusBarHeight - 100)
        const moveX = gestureState.moveX - x

        let move = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

        const moveAngle = move - editEndAngle
        let angle = editEndAngle + moveAngle

        if (angle < 0) {
          angle += 360
        }

        const calcTotalMinute = getCalcTotalMinute(angle)

        setEditEndAngle(calcTotalMinute * 0.25)
      },
      onPanResponderRelease: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + homeHeaderHeight + statusBarHeight - 100)
        const moveX = gestureState.moveX - x

        let move = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

        const moveAngle = move - editEndAngle
        let angle = editEndAngle + moveAngle

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
      <Svg style={{position: 'absolute'}}>
        <G>
          <Circle cx={dragStartBtnCoordinate.x} cy={dragStartBtnCoordinate.y} r={10} fill="#1E90FF" />
          <Circle
            {...startPanResponders.panHandlers}
            cx={dragStartBtnCoordinate.x}
            cy={dragStartBtnCoordinate.y}
            r={38}
            fill={'transparent'}
          />
        </G>
      </Svg>

      <Svg style={{position: 'absolute'}}>
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

export default EditSchedulePieController
