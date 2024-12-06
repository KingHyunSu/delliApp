import {useMemo} from 'react'
import {StyleSheet, View} from 'react-native'
import {DefaultOutline} from '@/components/timetableOutline'

interface Props {
  type: number
  backgroundColor: string
  progressColor: string
  radius: number
  percentage: number
}
const Outline = ({type, backgroundColor, progressColor, radius, percentage}: Props) => {
  const component = useMemo(() => {
    switch (type) {
      case 1:
        return (
          <DefaultOutline
            backgroundColor={backgroundColor}
            progressColor={progressColor}
            radius={radius}
            strokeWidth={20}
            percentage={percentage}
          />
        )
      default:
        return <></>
    }
  }, [type, backgroundColor, progressColor, radius, percentage])

  return <View style={styles.container}>{component}</View>
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  }
})

export default Outline
