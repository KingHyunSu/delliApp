import React from 'react'
import {G, Circle} from 'react-native-svg'

import SchedulePie from './SchedulePie'

import {polarToCartesian} from '../util'
import {trigger} from 'react-native-haptic-feedback'

import {useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleListState, activeTimeFlagState} from '@/store/schedule'

import {Schedule} from '@/types/schedule'
import {RANGE_FLAG} from '@/utils/types'

interface Props {
  data: Schedule
  scheduleList: Schedule[]
  x: number
  y: number
  radius: number
}

const EditSchedulePie = ({data, scheduleList, x, y, radius}: Props) => {
  const activeTimeFlag = useRecoilValue(activeTimeFlagState)
  const setScheduleListState = useSetRecoilState(scheduleListState)

  const startAngle = React.useMemo(() => {
    return data.start_time * 0.25
  }, [data.start_time])

  const endAngle = React.useMemo(() => {
    return data.end_time * 0.25
  }, [data.end_time])

  const dragStartBtnCoordinate = polarToCartesian(x, y, radius, startAngle)
  const dragEndBtnCoordinate = polarToCartesian(x, y, radius, endAngle)

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

      {activeTimeFlag === RANGE_FLAG.START && (
        <Circle cx={dragStartBtnCoordinate.x} cy={dragStartBtnCoordinate.y} r={12} fill={'#1E90FF'} />
      )}
      {activeTimeFlag === RANGE_FLAG.END && (
        <Circle cx={dragEndBtnCoordinate.x} cy={dragEndBtnCoordinate.y} r={12} fill={'#1E90FF'} />
      )}
    </G>
  )
}

export default EditSchedulePie
