import {Circle} from 'react-native-svg'

interface Props {
  x: number
  y: number
  radius: number
}
const Background = ({x, y, radius}: Props) => {
  return <Circle cx={x} cy={y} r={radius} fill={'#f9f9f9'} fillOpacity={1} />
}

export default Background
