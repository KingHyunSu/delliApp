import React from 'react'
import {PanResponder, Platform, StatusBar} from 'react-native'
import {G, Circle} from 'react-native-svg'

import SchedulePie from './SchedulePie'

import {polarToCartesian} from '../util'
import {getStatusBarHeight} from 'react-native-status-bar-height'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {scheduleListState, scheduleState} from '@/store/schedule'

import {Schedule} from '@/types/schedule'

interface Props {
  scheduleList: Schedule[]
  x: number
  y: number
  radius: number
  homeTopHeight: number
}

const InsertTimeTable = ({scheduleList, x, y, radius, homeTopHeight}: Props) => {
  /**
   * [todo]
   * ios에서는 moveY가 status bar 영역까지 계산되고 있는데 android에서는 어떻게 계산되는지 확인해보기
   * android에서 status bar 제외하고 계산되면 StatusBarHeight에 0 할당
   */
  const StatusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight || 0

  const setScheduleListState = useSetRecoilState(scheduleListState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const startAngle = React.useMemo(() => {
    return schedule.start_time * 0.25
  }, [schedule.start_time])

  const endAngle = React.useMemo(() => {
    return schedule.end_time * 0.25
  }, [schedule.end_time])

  React.useEffect(() => {
    const list = scheduleList.map(item => {
      const {start_time, end_time} = schedule

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
        return {...item, screenDisable: true}
      } else {
        return {...item, screenDisable: false}
      }
    })

    setScheduleListState(list)

    // Vibration.vibrate()
  }, [schedule.start_time, schedule.end_time])

  const dragStartBtnCoordinate = polarToCartesian(x, y, radius, endAngle)
  const dragEndBtnCoordinate = polarToCartesian(x, y, radius, startAngle)

  const startPanResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + homeTopHeight + StatusBarHeight - 100)
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
        const moveY = gestureState.moveY - (y + homeTopHeight + StatusBarHeight - 100)
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
        data={schedule}
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
        {/* <Circle
          {...endPanResponders.panHandlers}
          cx={dragStartBtnCoordinate.x}
          cy={dragStartBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        /> */}
      </G>

      <G>
        <Circle
          {...startPanResponders.panHandlers}
          cx={dragEndBtnCoordinate.x}
          cy={dragEndBtnCoordinate.y}
          r={10}
          fill="#1E90FF"
        />
        {/* <Circle
          {...startPanResponders.panHandlers}
          cx={dragEndBtnCoordinate.x}
          cy={dragEndBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        /> */}
      </G>
    </G>
  )
}

export default InsertTimeTable
