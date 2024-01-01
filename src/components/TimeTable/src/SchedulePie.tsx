import React from 'react'
import {G, Path, Text} from 'react-native-svg'

import {polarToCartesian, describeArc} from '../util'
import {getTimeOfMinute} from '@/utils/helper'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
  opacity?: number
  isEdit: Boolean
  onClick?: (value: Schedule) => void
}
const SchedulePie = ({data, x, y, radius, startAngle, endAngle, opacity = 1, isEdit, onClick}: Props) => {
  const STROK_WIDTH = 1

  const handleClick = () => {
    if (onClick) {
      onClick(data)
    }
  }

  const {path} = React.useMemo(() => {
    return describeArc({
      x,
      y,
      radius: radius - STROK_WIDTH / 2,
      startAngle,
      endAngle
    })
  }, [x, y, radius, startAngle, endAngle])

  const startTextPosition = React.useMemo(() => {
    return polarToCartesian(x, y, radius - 52, startAngle)
  }, [x, y, radius, startAngle])

  const endTextPosition = React.useMemo(() => {
    return polarToCartesian(x, y, radius - 52, endAngle - 8.5)
  }, [x, y, radius, endAngle])

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(startAngle * 4)
  }, [startAngle])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(endAngle * 4)
  }, [endAngle])

  return (
    <G>
      <Path
        d={path}
        fill={data.disable === '1' ? '#faf0f0' : data.background_color}
        fillOpacity={opacity}
        onPress={handleClick}
      />

      {isEdit && (
        <G opacity={data.disable === '1' ? 0.2 : 1}>
          <G x={startTextPosition.x} y={startTextPosition.y} rotation={startAngle - 90}>
            <Text x={25} y={14} fontSize={12} fill="#555555" textAnchor="middle" fontWeight={200}>
              {`${startTime.hour}:${startTime.minute}`}
            </Text>
          </G>

          <G x={endTextPosition.x} y={endTextPosition.y} rotation={endAngle - 90}>
            <Text x={25} y={14} fontSize={12} fill="#555555" textAnchor="middle" fontWeight={200}>
              {`${endTime.hour}:${endTime.minute}`}
            </Text>
          </G>
        </G>
      )}
    </G>
  )
}

export default SchedulePie
