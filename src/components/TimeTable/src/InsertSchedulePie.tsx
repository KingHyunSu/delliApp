import React from 'react'
import {PanResponder, Platform, StatusBar} from 'react-native'
import {G, Circle, Text} from 'react-native-svg'

import SchedulePie from './SchedulePie'

import {polarToCartesian} from '../util'
import {getStatusBarHeight} from 'react-native-status-bar-height'

import {useRecoilState} from 'recoil'
import {scheduleState} from '@/store/schedule'

interface Props {
  x: number
  y: number
  radius: number
}

const InsertTimeTable = ({x, y, radius}: Props) => {
  /**
   * [todo]
   * ios에서는 moveY가 status bar 영역까지 계산되고 있는데 android에서는 어떻게 계산되는지 확인해보기
   * android에서 status bar 제외하고 계산되면 StatusBarHeight에 0 할당
   */
  const StatusBarHeight =
    Platform.OS === 'ios'
      ? getStatusBarHeight(true)
      : StatusBar.currentHeight || 0

  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const startAngle = React.useMemo(() => {
    return schedule.start_time * 0.25
  }, [schedule.start_time])

  const endAngle = React.useMemo(() => {
    return schedule.end_time * 0.25
  }, [schedule.end_time])

  const dragStartBtnCoordinate = polarToCartesian(x, y, radius, endAngle)
  const dragEndBtnCoordinate = polarToCartesian(x, y, radius, startAngle)

  const startPanResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + StatusBarHeight)
        const moveX = gestureState.moveX - x

        let angle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

        if (angle < 0) {
          angle += 360
        }

        const totalMinute = angle / 0.25
        const hour = Math.floor(totalMinute / 60)
        const minute = Math.floor(totalMinute % 60)

        const calcTotalMinute = hour * 60 + minute

        setSchedule(prevState => {
          return {
            ...prevState,
            start_time: calcTotalMinute
          }
        })
      }
    })
  ).current

  const endPanResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + StatusBarHeight)
        const moveX = gestureState.moveX - x

        let move = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

        const moveAngle = move - endAngle
        let angle = endAngle + moveAngle

        if (angle < 0) {
          angle += 360
        }

        const totalMinute = angle / 0.25
        const hour = Math.floor(totalMinute / 60)
        const minute = Math.floor(totalMinute % 60)

        const calcTotalMinute = hour * 60 + minute

        setSchedule(prevState => {
          return {
            ...prevState,
            end_time: calcTotalMinute
          }
        })
      }
    })
  ).current

  return (
    <G>
      <SchedulePie
        x={x}
        y={y}
        radius={radius}
        startAngle={startAngle}
        endAngle={endAngle}
        fillOpacity={1}
      />
      <G>
        <Circle
          {...endPanResponders.panHandlers}
          cx={dragStartBtnCoordinate.x}
          cy={dragStartBtnCoordinate.y}
          r={10}
          fill="#BABABA"
        />
        <Circle
          {...endPanResponders.panHandlers}
          cx={dragStartBtnCoordinate.x}
          cy={dragStartBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        />
      </G>

      <G>
        <Circle
          {...startPanResponders.panHandlers}
          cx={dragEndBtnCoordinate.x}
          cy={dragEndBtnCoordinate.y}
          r={10}
          fill="#1E90FF"
        />
        <Circle
          {...startPanResponders.panHandlers}
          cx={dragEndBtnCoordinate.x}
          cy={dragEndBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        />
      </G>
    </G>
  )
}

export default InsertTimeTable
