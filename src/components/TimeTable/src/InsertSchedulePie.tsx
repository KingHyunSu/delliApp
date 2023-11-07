import React from 'react'
import {PanResponder} from 'react-native'
import {G, Circle, Text} from 'react-native-svg'

import SchedulePie from './SchedulePie'

import {polarToCartesian} from '../util'
import {trigger} from 'react-native-haptic-feedback'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {
  scheduleListState,
  scheduleState,
  activeStartTimeControllerState,
  activeEndTimeControllerState
} from '@/store/schedule'

import {Schedule} from '@/types/schedule'

interface Props {
  scheduleList: Schedule[]
  x: number
  y: number
  radius: number
  statusBarHeight: number
  homeTopHeight: number
}

const InsertTimeTable = ({scheduleList, x, y, radius, statusBarHeight, homeTopHeight}: Props) => {
  const [activeStartTimeController, setActiveStartTimeController] = useRecoilState(activeStartTimeControllerState)
  const [activeEndTimeController, setActiveEndTimeController] = useRecoilState(activeEndTimeControllerState)
  const setScheduleListState = useSetRecoilState(scheduleListState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const startAngle = React.useMemo(() => {
    return schedule.start_time * 0.25
  }, [schedule.start_time])

  const endAngle = React.useMemo(() => {
    return schedule.end_time * 0.25
  }, [schedule.end_time])

  React.useEffect(() => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    }
    trigger('impactLight', options)

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
  }, [schedule.start_time, schedule.end_time])

  const dragEndBtnCoordinate = polarToCartesian(x, y, radius, endAngle)
  const dragStartBtnCoordinate = polarToCartesian(x, y, radius, startAngle)

  const startPanResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setActiveStartTimeController(true)
      },
      onPanResponderRelease: () => {
        setActiveStartTimeController(false)
      },
      onPanResponderMove: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + homeTopHeight + statusBarHeight - 100)
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
      onPanResponderGrant: () => {
        setActiveEndTimeController(true)
      },
      onPanResponderRelease: () => {
        setActiveEndTimeController(false)
      },
      onPanResponderMove: (event, gestureState) => {
        const moveY = gestureState.moveY - (y + homeTopHeight + statusBarHeight - 100)
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
      <SchedulePie data={schedule} x={x} y={y} radius={radius} startAngle={startAngle} endAngle={endAngle} />

      <G>
        <Circle
          cx={dragStartBtnCoordinate.x}
          cy={dragStartBtnCoordinate.y}
          r={12}
          fill={activeStartTimeController ? '#1E90FF' : '#BABABA'}
        />
        <Circle
          {...startPanResponders.panHandlers}
          cx={dragStartBtnCoordinate.x}
          cy={dragStartBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        />
        <Text
          x={dragStartBtnCoordinate.x}
          y={dragStartBtnCoordinate.y + 4}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontFamily="GmarketSansTTFBold">
          S
        </Text>
      </G>

      <G>
        <Circle
          cx={dragEndBtnCoordinate.x}
          cy={dragEndBtnCoordinate.y}
          r={12}
          fill={activeEndTimeController ? '#1E90FF' : '#BABABA'}
        />
        <Circle
          {...endPanResponders.panHandlers}
          cx={dragEndBtnCoordinate.x}
          cy={dragEndBtnCoordinate.y}
          r={38}
          fill={'transparent'}
        />
        <Text
          x={dragEndBtnCoordinate.x}
          y={dragEndBtnCoordinate.y + 4}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontFamily="GmarketSansTTFBold">
          E
        </Text>
      </G>
    </G>
  )
}

export default InsertTimeTable
