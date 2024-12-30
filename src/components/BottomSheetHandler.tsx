import {useMemo} from 'react'
import {StyleSheet, View} from 'react-native'
import {BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useDerivedValue} from 'react-native-reanimated'
import {toRad} from 'react-native-redash'
import {Shadow} from 'react-native-shadow-2'
import {useRecoilValue} from 'recoil'

// @ts-ignore
export const transformOrigin = ({x, y}, ...transformations) => {
  'worklet'
  return [{translateX: x}, {translateY: y}, ...transformations, {translateX: x * -1}, {translateY: y * -1}]
}

const shadowSides = {top: true, bottom: false, start: false, end: false}
const shadowCorners = {
  topStart: true,
  topEnd: true,
  bottomStart: false,
  bottomEnd: false
}

interface Props extends BottomSheetHandleProps {
  shadow?: boolean
  maxSnapIndex?: 1 | 2 | 3
  backgroundColor?: string
}

const inputInterpolate = [-0.6, 0, 1, 2]
const BottomSheetHandler = ({shadow = true, maxSnapIndex = 3, animatedIndex, backgroundColor}: Props) => {
  const outputIndicatorTransformOriginY = useMemo(() => {
    if (maxSnapIndex === 1) {
      return [0, 1, 1, 1]
    } else if (maxSnapIndex === 2) {
      return [0, -1, 1, 1]
    }
    return [0, -1, 0, 1]
  }, [maxSnapIndex])

  const outputLeftIndicator = useMemo(() => {
    if (maxSnapIndex === 1) {
      return [0, toRad(30), toRad(30), toRad(30)]
    } else if (maxSnapIndex === 2) {
      return [0, toRad(-30), toRad(30), toRad(30)]
    }
    return [0, toRad(-30), 0, toRad(30)]
  }, [maxSnapIndex])

  const outputRightIndicator = useMemo(() => {
    if (maxSnapIndex === 1) {
      return [0, toRad(-30), toRad(-30), toRad(-30)]
    } else if (maxSnapIndex === 2) {
      return [0, toRad(30), toRad(-30), toRad(-30)]
    }
    return [0, toRad(30), 0, toRad(-30)]
  }, [maxSnapIndex])

  //#region animations
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(animatedIndex.value, inputInterpolate, outputIndicatorTransformOriginY, Extrapolation.CLAMP)
  )
  //#endregion

  //#region styles
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator
    }),
    []
  )

  const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      animatedIndex.value,
      inputInterpolate,
      outputLeftIndicator,
      Extrapolation.CLAMP
    )
    return {
      transform: transformOrigin(
        {x: 0, y: indicatorTransformOriginY.value},
        {
          rotate: `${leftIndicatorRotate}rad`
        },
        {
          translateX: -5
        }
      )
    }
  })

  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator
    }),
    []
  )

  const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      animatedIndex.value,
      inputInterpolate,
      outputRightIndicator,
      Extrapolation.CLAMP
    )
    return {
      transform: transformOrigin(
        {x: 0, y: indicatorTransformOriginY.value},
        {
          rotate: `${rightIndicatorRotate}rad`
        },
        {
          translateX: 5
        }
      )
    }
  })
  //#endregion

  const containerStyle = useMemo(() => {
    return [styles.container, {backgroundColor}]
  }, [backgroundColor])

  return (
    // <Shadow
    //   disabled={!shadow}
    //   startColor="#f0eff586"
    //   distance={10}
    //   sides={shadowSides}
    //   corners={shadowCorners}
    //   style={styles.shadowContainer}>
    <View style={containerStyle} renderToHardwareTextureAndroid={true}>
      <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
      <Animated.View style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]} />
    </View>
    // </Shadow>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%'
  },
  container: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10
  },
  indicator: {
    position: 'absolute',
    width: 12,
    height: 4,
    backgroundColor: '#999'
  },
  leftIndicator: {
    borderRadius: 2
  },
  rightIndicator: {
    borderRadius: 2
  }
})

export default BottomSheetHandler
