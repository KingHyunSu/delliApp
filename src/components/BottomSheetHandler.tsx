import React, {useMemo} from 'react'
import {StyleSheet, View} from 'react-native'
import {BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useDerivedValue} from 'react-native-reanimated'
import {toRad} from 'react-native-redash'
import {Shadow} from 'react-native-shadow-2'

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
  maxSnapIndex?: 1 | 2 | 3
}

const BottomSheetHandler = ({maxSnapIndex = 3, animatedIndex}: Props) => {
  const inputInterpolate = [-0.6, 0, 1, 2]

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

  return (
    <Shadow
      startColor="#f0eff586"
      distance={10}
      sides={shadowSides}
      corners={shadowCorners}
      style={styles.shadowContainer}>
      <View style={styles.header} renderToHardwareTextureAndroid={true}>
        <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
        <Animated.View style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]} />
      </View>
    </Shadow>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e7e7eb89',

    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  header: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10
  },
  indicator: {
    position: 'absolute',
    width: 10,
    height: 4,
    backgroundColor: '#999'
  },
  leftIndicator: {
    borderTopStartRadius: 2,
    borderBottomStartRadius: 2
  },
  rightIndicator: {
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2
  }
})

export default BottomSheetHandler
