import React from 'react'
import {useWindowDimensions} from 'react-native'
import {Svg, G, Text} from 'react-native-svg'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import InsertSchedulePie from './src/InsertSchedulePie'

interface Props {
  isInsertMode: Boolean
  onClick: Function
}
const TimeTable = ({isInsertMode, onClick}: Props) => {
  const {width} = useWindowDimensions()
  const x = width / 2
  const y = width / 2
  const radius = width / 2 - 36

  return (
    <Svg onPress={() => onClick()}>
      <G>
        <Background x={x} y={y} radius={radius} />

        <G opacity={isInsertMode ? 0.5 : 1}>
          <SchedulePie
            x={x}
            y={y}
            radius={radius}
            startAngle={90}
            endAngle={240}
          />
        </G>

        {isInsertMode && <InsertSchedulePie x={x} y={y} radius={radius} />}
        {/* <Text x={x} y={y} fontSize={18} fill={'#BABABA'} textAnchor="middle">
          터치하여 일정 추가하기
        </Text> */}
      </G>
    </Svg>
  )
}

export default TimeTable
