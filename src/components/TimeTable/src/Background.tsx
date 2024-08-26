import React from 'react'
import {Circle} from 'react-native-svg'

interface Props {
  x: number
  y: number
  radius: number
}
const Background = ({x, y, radius}: Props) => {
  return <Circle cx={x} cy={y} r={radius} fill={'#f5f6f8'} fillOpacity={1} strokeWidth={0.4} stroke={'#f5f6f8'} />
}

export default Background
