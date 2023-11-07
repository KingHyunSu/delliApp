import React from 'react'
import {G, Path, Text} from 'react-native-svg'

import {polarToCartesian, describeArc} from '../util'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
}

const SchedulePie = ({data, x, y, radius, startAngle, endAngle}: Props) => {
  const STROK_WIDTH = 1

  const absAngle = Math.abs(startAngle - endAngle)
  const isBigPie = absAngle >= 50

  const {path} = React.useMemo(() => {
    return describeArc({
      x,
      y,
      radius: radius - STROK_WIDTH / 2,
      startAngle,
      endAngle
    })
  }, [x, y, radius, startAngle, endAngle])

  /** 텍스트 회전값 */
  const getStartAngleByTextRotation = (angle: number) => {
    if (isBigPie) {
      // 원뿔각이 90도 이상이면 회전 없음
      return 0
    }

    if (angle > 180) {
      return startAngle + Math.abs(startAngle - endAngle) + 80
    }

    return startAngle + Math.abs(startAngle - endAngle) - 100
  }

  /** 원뿔 크기 조절 (=텍스트 상하 조절값) */
  const getStartAngleByRadius = (angle: number) => {
    if (isBigPie) {
      if (startAngle > 180) {
        return radius / 1.1 - 16
      } else {
        return radius / 1.5 - 16
      }
    }

    if (angle > 180) {
      return radius - 16
    }

    return radius / 2 - 16
  }

  /** 원뿔 각도 조절 (=텍스트 좌우 조절값) */
  const getPositionByDegrees = (): number => {
    if (isBigPie) {
      if (startAngle <= 90) {
        return absAngle / 1.5 - 16 + startAngle
      } else if (startAngle > 270) {
        return absAngle / 5 - 16 + startAngle
      } else {
        return absAngle / 1.3 + startAngle
      }
    }
    return absAngle / 2 + startAngle
  }

  const textCoordinate = polarToCartesian(x, y, getStartAngleByRadius(startAngle), getPositionByDegrees())

  return (
    <G>
      <Path d={path} fill={data.screenDisable ? '#e2e2e2' : '#fff'} stroke={'#efefef'} fillOpacity={1} />

      {/* todo timetable/index로 빼기 */}
      <G x={textCoordinate.x} y={textCoordinate.y} rotation={0}>
        <Text fontFamily="GmarketSansTTFMedium" fontSize={14}>
          {data.title}
        </Text>
      </G>
    </G>
  )
}

export default SchedulePie
