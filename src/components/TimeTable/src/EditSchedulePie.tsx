import React from 'react'
import SchedulePie from './SchedulePie'

import {useRecoilState} from 'recoil'
import {editStartAngleState, editEndAngleState} from '@/store/schedule'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
}

const EditSchedulePie = ({data, x, y, radius}: Props) => {
  const [editStartAngle, setEditStartAngle] = useRecoilState(editStartAngleState)
  const [editEndAngle, setEditEndAngle] = useRecoilState(editEndAngleState)

  return <SchedulePie data={data} x={x} y={y} radius={radius} startAngle={editStartAngle} endAngle={editEndAngle} />
}

export default EditSchedulePie
