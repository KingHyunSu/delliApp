import React from 'react'
import {useWindowDimensions} from 'react-native'
import {Svg, G, Text} from 'react-native-svg'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import InsertSchedulePie from './src/InsertSchedulePie'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule[]
  homeTopHeight: number
  isEdit: Boolean
  onClick: Function
}
const TimeTable = ({data, homeTopHeight, isEdit, onClick}: Props) => {
  const {width, height} = useWindowDimensions()
  const x = width / 2
  const y = height * 0.28
  const fullRadius = width / 2 - 36
  const radius = React.useMemo(() => {
    let result = fullRadius - (20 - (y - fullRadius - 20))

    if (result > fullRadius) {
      return fullRadius
    }

    return result
  }, [fullRadius, y])

  const list = React.useMemo(() => {
    return data.filter(item => item.disable === '0')
  }, [data])

  return (
    <Svg onPress={() => onClick()}>
      <G>
        <Background x={x} y={y} radius={radius} />

        <G opacity={isEdit ? 0.5 : 1}>
          {list.length > 0 ? (
            list.map((item, index) => {
              const startAngle = item.start_time * 0.25
              const endAngle = item.end_time * 0.25

              return (
                <SchedulePie
                  key={index}
                  data={item}
                  x={x}
                  y={y}
                  radius={radius}
                  startAngle={startAngle}
                  endAngle={endAngle}
                />
              )
            })
          ) : (
            <Text x={x} y={y} fontSize={18} fill={'#BABABA'} fontFamily={'GmarketSansTTFBold'} textAnchor="middle">
              터치하여 일정 추가하기
            </Text>
          )}
        </G>

        {isEdit && <InsertSchedulePie scheduleList={data} x={x} y={y} radius={radius} homeTopHeight={homeTopHeight} />}
      </G>
    </Svg>
  )
}

export default TimeTable
