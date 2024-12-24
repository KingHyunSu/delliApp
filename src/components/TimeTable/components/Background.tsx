import {Circle} from 'react-native-svg'
import {useRecoilValue} from 'recoil'
import {activeBackgroundState} from '@/store/system'

interface Props {
  x: number
  y: number
  radius: number
}
const Background = ({x, y, radius}: Props) => {
  const activeBackground = useRecoilValue(activeBackgroundState)

  return <Circle cx={x} cy={y} r={radius} fill={activeBackground.background_color} fillOpacity={1} />
}

export default Background
