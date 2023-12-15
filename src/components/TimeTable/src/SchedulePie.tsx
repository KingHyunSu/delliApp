import React from 'react'
import {Path} from 'react-native-svg'

import {describeArc} from '../util'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
  opacity?: number
  onClick?: (value: Schedule) => void
}
const SchedulePie = ({data, x, y, radius, startAngle, endAngle, opacity = 1, onClick}: Props) => {
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

  return (
    <Path
      d={path}
      fill={data.screenDisable ? '#e2e2e2' : data.background_color}
      stroke={'#efefef'}
      fillOpacity={opacity}
      onPress={handleClick}
    />
  )
}

export default SchedulePie
