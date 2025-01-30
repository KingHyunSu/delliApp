import {useCallback} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import {interpolate} from 'react-native-reanimated'
import Carousel, {TAnimationStyle} from 'react-native-reanimated-carousel'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import AppBar from '@/components/AppBar'

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const ScheduleCompleteCardDetailList = () => {
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const scale = 0.85
  const ITEM_WIDTH = 100
  const ITEM_HEIGHT = 125
  const RIGHT_OFFSET = windowDimensions.width * (1 - scale)

  const animationStyle = useCallback(
    (value: number) => {
      'worklet'

      const translateY = interpolate(value, [-1, 0, 1], [-ITEM_HEIGHT, 0, ITEM_HEIGHT])
      const right = interpolate(value, [-1, -0.2, 1], [RIGHT_OFFSET / 2, RIGHT_OFFSET, RIGHT_OFFSET / 3])
      return {
        transform: [{translateY}],
        right
      }
    },
    [RIGHT_OFFSET]
  )

  return (
    <View style={styles.container}>
      <AppBar backPress />

      <View style={styles.wrapper}>
        <Carousel
          vertical
          style={{
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}
          width={ITEM_WIDTH}
          height={ITEM_HEIGHT}
          data={data}
          customAnimation={animationStyle}
          renderItem={({index}) => {
            return (
              <View key={index} style={{flex: 1, padding: 10}}>
                <Image
                  style={{width: '100%', height: '100%'}}
                  source={{uri: 'https://cdn.delli.info/complete/thumb/2025/01/26/228.jpeg'}}
                />
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    // paddingHorizontal: 16
  }
})

export default ScheduleCompleteCardDetailList
