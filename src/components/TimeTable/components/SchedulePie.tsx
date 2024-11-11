import React from 'react'
import {Path} from 'react-native-svg'

import {describeArc} from '@/utils/pieHelper'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
  startTime: number
  endTime: number
  opacity?: number
  isEdit?: Boolean
  disableScheduleList?: ExistSchedule[]
  onClick?: (value: Schedule) => void
}

const STROK_WIDTH = 1

const SchedulePie = ({
  data,
  x,
  y,
  radius,
  startTime = -1,
  endTime = -1,
  opacity,
  isEdit = false,
  disableScheduleList,
  onClick
}: Props) => {
  const isDisabled = React.useMemo(() => {
    if (isEdit && disableScheduleList) {
      return disableScheduleList.some(item => item.schedule_id === data.schedule_id)
    }

    return false
  }, [isEdit, disableScheduleList, data.schedule_id])

  const backgroundColor = React.useMemo(() => {
    return isDisabled ? '#faf0f0' : data.background_color
  }, [isDisabled, data.background_color])

  const startAngle = React.useMemo(() => {
    return startTime * 0.25
  }, [startTime])

  const endAngle = React.useMemo(() => {
    return endTime * 0.25
  }, [endTime])

  const {path} = React.useMemo(() => {
    return describeArc({
      x,
      y,
      radius: radius - STROK_WIDTH / 2,
      startAngle,
      endAngle
    })
  }, [x, y, radius, startAngle, endAngle])

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(data)
    }
  }, [onClick, data])

  if (startTime === -1 && endTime === -1) {
    return <></>
  }

  return <Path d={path} fill={backgroundColor} fillOpacity={1} onPress={handleClick} />
}

export default SchedulePie
