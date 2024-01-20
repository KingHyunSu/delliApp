import React from 'react'
import {Path} from 'react-native-svg'

import {useRecoilValue} from 'recoil'
import {disableScheduleIdListState} from '@/store/schedule'

import {describeArc} from '../util'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
  opacity?: number
  onClick?: (value: Schedule) => void
}

const STROK_WIDTH = 1

const SchedulePie = ({data, x, y, radius, opacity, onClick}: Props) => {
  const disableScheduleIdList = useRecoilValue(disableScheduleIdListState)

  const isDisabled = React.useMemo(() => {
    return disableScheduleIdList.some(item => item.schedule_id === data.schedule_id)
  }, [disableScheduleIdList, data.schedule_id])

  const startAngle = React.useMemo(() => {
    return data.start_time * 0.25
  }, [data.start_time])

  const endAngle = React.useMemo(() => {
    return data.end_time * 0.25
  }, [data.end_time])

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
  }, [])

  return (
    <Path
      d={path}
      fill={isDisabled ? '#faf0f0' : data.background_color}
      // fill={data.background_color}
      fillOpacity={opacity}
      onPress={handleClick}
    />
  )
}

export default SchedulePie
