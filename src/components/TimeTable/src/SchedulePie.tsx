import React from 'react'
import {Path} from 'react-native-svg'

import {describeArc} from '../util'

interface Props {
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
  color: string
  opacity?: number
  disable?: boolean
}
const SchedulePie = ({x, y, radius, startAngle, endAngle, color, opacity = 1, disable = false}: Props) => {
  const STROK_WIDTH = 1

  const {path} = React.useMemo(() => {
    return describeArc({
      x,
      y,
      radius: radius - STROK_WIDTH / 2,
      startAngle,
      endAngle
    })
  }, [x, y, radius, startAngle, endAngle])

  return <Path d={path} fill={disable ? '#e2e2e2' : color} stroke={'#efefef'} fillOpacity={opacity} />
}

export default SchedulePie
