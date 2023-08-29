import React from 'react'
import {useWindowDimensions} from 'react-native'
import {Svg, G, Text} from 'react-native-svg'

import Background from './src/Background'

interface Props {
  onClick: Function
}
const TimeTable = ({onClick}: Props) => {
  const {width} = useWindowDimensions()
  const x = width / 2
  const y = width / 2
  const radius = width / 2 - 36

  return (
    <Svg onPress={() => onClick()}>
      <G>
        <Background x={x} y={y} radius={radius} />
        <Text x={x} y={y} fontSize={18} fill={'#BABABA'} textAnchor="middle">
          터치하여 일정 추가하기
        </Text>
      </G>
    </Svg>
  )
}

export default TimeTable
