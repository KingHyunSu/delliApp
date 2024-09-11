import React from 'react'
import Svg, {Path, Circle} from 'react-native-svg'
import {describeArc} from '@/utils/pieHelper'
import type {CategoryStatsList} from '@/@types/stats'

interface Props {
  size: number
  totalTime: number
  data: CategoryStatsList[]
}
const Pie = ({size, totalTime, data}: Props) => {
  const getDescribeArc = React.useCallback((startAngle: number, endAngle: number) => {
    return describeArc({
      x: size / 2,
      y: size / 2,
      radius: size / 2,
      startAngle,
      endAngle
    })
  }, [])

  const PieList = React.useMemo(() => {
    if (totalTime === -1) {
      return <></>
    }

    let prevPercentage = 0

    return data.map((item, index) => {
      const percentage = Math.round((item.totalTime / totalTime) * 360)
      const {path} = getDescribeArc(prevPercentage, percentage + prevPercentage)

      prevPercentage = percentage + prevPercentage

      return <Path key={index} d={path} fill={item.color} />
    })
  }, [totalTime, data])

  return (
    <Svg width={size} height={size}>
      {PieList}
      <Circle cx={size / 2} cy={size / 2} r={size / 2 - 25} fill="#ffffff" />
    </Svg>
  )
}

export default Pie
