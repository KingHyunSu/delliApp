import React from 'react'
import {G, Defs, Path, TextPath, Text} from 'react-native-svg'
import SchedulePie from './SchedulePie'

import {describeBorder} from '../util'

interface Props {
  data: Schedule
  x: number
  y: number
  radius: number
  scheduleList: Schedule[]
  disableScheduleList: ExistSchedule[]
}

const EditSchedulePie = ({data, x, y, radius, scheduleList, disableScheduleList}: Props) => {
  const getRenderPath = React.useCallback(
    (startAngle: number, endAngle: number, _radius?: number) => {
      const {path} = describeBorder({
        x,
        y,
        radius: _radius || radius,
        startAngle,
        endAngle
      })
      return path
    },
    [x, y, radius]
  )

  const getTime = React.useCallback((startAngle: number, endAngle: number) => {
    let time = (endAngle - startAngle) * 4

    if (endAngle < startAngle) {
      time += 1440
    }

    return time
  }, [])

  const getTimeText = React.useCallback((time: number) => {
    if (time === 0) {
      return ''
    }

    const hour = Math.floor(time / 60)
    const minute = time % 60

    const hourText = hour > 0 ? `${hour}시간 ` : ''
    const minuteText = minute > 0 ? `${minute}분` : ''
    const surffixText = minute > 0 ? ' 전' : '전'

    return hourText + minuteText + surffixText
  }, [])

  const nearSchedule = React.useMemo(() => {
    let list = [...scheduleList]

    const existSchedule = list.some(item => item.schedule_id === data.schedule_id)

    if (!existSchedule) {
      list.push(data)
    }

    list = list
      .filter(item => {
        return !disableScheduleList.some(sItem => sItem.schedule_id === item.schedule_id)
      })
      .sort((a, b) => {
        return a.start_time - b.start_time
      })

    const isNextDayScheduleIndex = list.findIndex(item => item.start_time > item.end_time)

    if (isNextDayScheduleIndex !== -1) {
      const _schedule = list.splice(isNextDayScheduleIndex, 1)
      list.unshift(_schedule[0])
    }

    const currentScheduleIndex = list.findIndex(item => item.schedule_id === data.schedule_id)
    if (list.length > 0 && currentScheduleIndex !== -1) {
      let prevSchedule = null
      let nextSchedule = null

      if (list[currentScheduleIndex - 1]) {
        prevSchedule = list[currentScheduleIndex - 1]
      } else if (list.length > 1) {
        prevSchedule = list[list.length - 1]
      }

      if (list[currentScheduleIndex + 1]) {
        nextSchedule = list[currentScheduleIndex + 1]
      } else if (list.length > 1) {
        nextSchedule = list[0]
      }

      return {
        prevSchedule,
        nextSchedule
      }
    }

    return null
  }, [disableScheduleList, scheduleList, data])

  const prevScheduleInfo = React.useMemo(() => {
    if (nearSchedule && nearSchedule.prevSchedule) {
      const prevStartAngle = nearSchedule.prevSchedule.end_time * 0.25
      const prevEndAngle = data.start_time * 0.25

      const time = getTime(prevStartAngle, prevEndAngle)
      const moveRightAngle = 5

      const borderPath = getRenderPath(prevStartAngle, prevEndAngle)
      const textPath = getRenderPath(prevEndAngle, prevEndAngle - moveRightAngle, radius - 15)

      return {
        border: {
          path: borderPath
        },
        text: {
          path: textPath,
          value: getTimeText(time)
        }
      }
    }

    return null
  }, [nearSchedule, radius, data.start_time, getTime, getRenderPath, getTimeText])

  const nextScheduleInfo = React.useMemo(() => {
    if (nearSchedule && nearSchedule.nextSchedule) {
      const nextStartAngle = data.end_time * 0.25
      const nextEndAngle = nearSchedule.nextSchedule.start_time * 0.25

      const time = getTime(nextStartAngle, nextEndAngle)
      const moveRightAngle = 5

      const borderPath = getRenderPath(nextStartAngle, nextEndAngle)
      const textPath = getRenderPath(nextStartAngle + moveRightAngle, nextEndAngle + 100, radius - 15)

      return {
        border: {
          path: borderPath
        },
        text: {
          path: textPath,
          value: getTimeText(time)
        }
      }
    }

    return null
  }, [nearSchedule, radius, data.end_time, getTime, getRenderPath, getTimeText])

  return (
    <G>
      <SchedulePie data={data} x={x} y={y} radius={radius} />

      {prevScheduleInfo && (
        <G>
          <Path d={prevScheduleInfo.border.path} fill={'none'} stroke={'#ffe2e2'} strokeWidth={1} />

          <G>
            <Defs>
              <Path id="prevPath" d={prevScheduleInfo.text.path} />
            </Defs>

            <TextPath href="#prevPath" startOffset="100%">
              <Text fontSize={12} fill="#424242" textAnchor="end">
                {prevScheduleInfo.text.value}
              </Text>
            </TextPath>
          </G>
        </G>
      )}

      {nextScheduleInfo && (
        <G>
          <Path d={nextScheduleInfo.border.path} fill={'none'} stroke={'#ffe2e2'} strokeWidth={1} />

          <G>
            <Defs>
              <Path id="nextPath" d={nextScheduleInfo.text.path} />
            </Defs>

            <TextPath href="#nextPath">
              <Text fontSize={12} fill="#424242">
                {nextScheduleInfo.text.value}
              </Text>
            </TextPath>
          </G>
        </G>
      )}
    </G>
  )
}

export default EditSchedulePie
