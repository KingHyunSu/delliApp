import React from 'react'
import {PanResponder} from 'react-native'
import {G, Circle, Text} from 'react-native-svg'

import SchedulePie from './SchedulePie'

import {polarToCartesian} from '../util'
import {trigger} from 'react-native-haptic-feedback'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {scheduleListState, activeStartTimeControllerState, activeEndTimeControllerState} from '@/store/schedule'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule
  scheduleList: Schedule[]
  x: number
  y: number
  radius: number
  statusBarHeight: number
  homeTopHeight: number
  isComponentEdit: boolean
  onChangeSchedule: Function
}

const EditSchedulePie = ({
  data,
  scheduleList,
  x,
  y,
  radius,
  statusBarHeight,
  homeTopHeight,
  isComponentEdit,
  onChangeSchedule
}: Props) => {
  const [activeStartTimeController, setActiveStartTimeController] = useRecoilState(activeStartTimeControllerState)
  const [activeEndTimeController, setActiveEndTimeController] = useRecoilState(activeEndTimeControllerState)
  const setScheduleListState = useSetRecoilState(scheduleListState)

  const accX = React.useRef(0)
  const accY = React.useRef(0)

  const startAngle = React.useMemo(() => {
    return data.start_time * 0.25
  }, [data.start_time])

  const endAngle = React.useMemo(() => {
    return data.end_time * 0.25
  }, [data.end_time])

  const getCalcTotalMinute = (angle: number) => {
    const totalMinute = angle / 0.25
    const hour = Math.floor(totalMinute / 60)
    const minute = Math.floor(totalMinute % 60)

    return hour * 60 + minute
  }

  React.useEffect(() => {
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })

    const list = scheduleList.map(item => {
      const start_time = data.start_time
      const end_time = data.end_time

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
  }, [data.start_time, data.end_time])

  const dragEndBtnCoordinate = polarToCartesian(x, y, radius, endAngle)
  const dragStartBtnCoordinate = polarToCartesian(x, y, radius, startAngle)

  const startPanResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setActiveStartTimeController(true)
      },
      onPanResponderRelease: () => {
        accX.current = 0
        accY.current = 0
        setActiveStartTimeController(false)
      },
      onPanResponderMove: (event, gestureState) => {
        // console.log('speed', Math.sqrt(gestureState.vx ** 2 + gestureState.vy ** 2))
        const speed = Math.round(Math.sqrt(gestureState.vx ** 2 + gestureState.vy ** 2) * 1000)

        console.log('speed', speed)
        const x0 = gestureState.x0
        const y0 = gestureState.y0
        let dx = gestureState.dx
        let dy = gestureState.dy

        if (speed <= 50) {
          dx = accX.current + (dx + -accX.current) / 5
          dy = accY.current + (dy + -accY.current) / 5
        } else {
          accX.current = dx
          accY.current = dy
        }

        const moveX = x0 + dx - x
        const moveY = y0 + dy - (y + (homeTopHeight + statusBarHeight - 100))

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
      onPanResponderGrant: () => {
        setActiveEndTimeController(true)
      },
      onPanResponderRelease: () => {
        accX.current = 0
        accY.current = 0
        setActiveEndTimeController(false)
      },
      onPanResponderMove: (event, gestureState) => {
        const speed = Math.round(Math.sqrt(gestureState.vx ** 2 + gestureState.vy ** 2) * 1000)

        const x0 = gestureState.x0
        const y0 = gestureState.y0
        let dx = gestureState.dx
        let dy = gestureState.dy

        if (speed <= 100) {
          dx = accX.current + (dx + -accX.current) / 5
          dy = accY.current + (dy + -accY.current) / 5
        } else {
          accX.current = dx
          accY.current = dy
        }

        const moveX = x0 + dx - x
        const moveY = y0 + dy - (y + (homeTopHeight + statusBarHeight - 100))

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
    <G>
      <SchedulePie
        x={x}
        y={y}
        radius={radius}
        startAngle={startAngle}
        endAngle={endAngle}
        color={data.background_color}
      />

      {!isComponentEdit && (
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
      )}

      {!isComponentEdit && (
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
      )}
    </G>
  )
}

export default EditSchedulePie
