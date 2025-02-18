import {useEffect, useMemo, useState} from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS, withTiming} from 'react-native-reanimated'
import RotateGuideIcon from '@/assets/icons/rotate_guide.svg'
import {trigger} from 'react-native-haptic-feedback'

interface Props {
  value: ScheduleCompletePhotoCardText
  enabled: boolean
  gestureSafeArea: number
  onChangeTransform: (value: {x: number; y: number; rotate: number; scale: number}) => void
  onPress: () => void
}
const PhotoCardText = ({value, enabled, gestureSafeArea = 10, onChangeTransform, onPress}: Props) => {
  const [isEdit, setIsEdit] = useState(false)
  const [savedTranslateX, setSavedTranslateX] = useState(value.x)
  const [savedTranslateY, setSavedTranslateY] = useState(value.y)
  const [savedRotation, setSavedRotation] = useState(value.rotate)
  const [savedScale, setSavedScale] = useState(value.scale)
  const [isRotationBlock, setIsRotationBlock] = useState(false)

  const opacity = useSharedValue(0)
  const translateX = useSharedValue(value.x)
  const translateY = useSharedValue(value.y)
  const rotation = useSharedValue(value.rotate)
  const scale = useSharedValue(value.scale)

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))
  const editContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {rotateZ: `${(rotation.value / Math.PI) * 180}deg`},
      {scale: scale.value}
    ]
  }))

  const editContainerStyle = useMemo(() => {
    const padding = gestureSafeArea < 10 ? 10 : gestureSafeArea
    return [editContainerAnimatedStyle, styles.container, {padding}]
  }, [gestureSafeArea])

  const containerStyle = useMemo(() => {
    return [
      styles.container,
      {
        transform: [
          {translateX: savedTranslateX},
          {translateY: savedTranslateY},
          {rotateZ: `${(savedRotation / Math.PI) * 180}deg`},
          {scale: savedScale}
        ]
      }
    ]
  }, [savedTranslateX, savedTranslateY, savedRotation, savedScale])

  const textStyle = useMemo(() => {
    return [styles.text, {color: value.textColor, fontFamily: value.font}]
  }, [value.textColor, value.font])

  const moveGesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = savedTranslateX + e.translationX
      translateY.value = savedTranslateY + e.translationY
    })
    .onEnd(() => {
      runOnJS(setSavedTranslateX)(translateX.value)
      runOnJS(setSavedTranslateY)(translateY.value)

      runOnJS(onChangeTransform)({
        x: translateX.value,
        y: translateY.value,
        rotate: rotation.value,
        scale: scale.value
      })
    })

  const rotateGesture = Gesture.Rotation()
    .onUpdate(e => {
      const speed = Math.abs(e.velocity)
      const _rotation = savedRotation + e.rotation

      if (isRotationBlock) {
        if (Math.abs(_rotation) > 0.08) {
          runOnJS(setIsRotationBlock)(false)
        } else {
          return
        }
      }

      if (Math.abs(_rotation) < 0.08 && speed < 0.5) {
        runOnJS(setIsRotationBlock)(true)
        rotation.value = 0

        runOnJS(trigger)('soft', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false
        })
      } else {
        rotation.value = _rotation
      }
    })
    .onEnd(() => {
      runOnJS(setSavedRotation)(rotation.value)

      runOnJS(onChangeTransform)({
        x: translateX.value,
        y: translateY.value,
        rotate: rotation.value,
        scale: scale.value
      })
    })

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale * e.scale
    })
    .onEnd(() => {
      runOnJS(setSavedScale)(scale.value)

      runOnJS(onChangeTransform)({
        x: translateX.value,
        y: translateY.value,
        rotate: rotation.value,
        scale: scale.value
      })
    })

  const composeGesture = Gesture.Simultaneous(moveGesture, rotateGesture, pinchGesture)

  useEffect(() => {
    if (enabled) {
      setIsEdit(true)
      opacity.value = withTiming(1)
    } else {
      opacity.value = withTiming(0, {duration: 300}, () => {
        runOnJS(setIsEdit)(false)
      })
    }
  }, [enabled])

  return (
    <>
      {isEdit ? (
        <GestureDetector gesture={composeGesture}>
          <Animated.View style={editContainerStyle}>
            <Animated.View style={[overlayAnimatedStyle, styles.overlay]}>
              <View style={styles.overlayItem}>
                <RotateGuideIcon fill="#ffffff" width={20} height={20} style={styles.rotateGuideIcon1} />
                <RotateGuideIcon fill="#ffffff" width={20} height={20} style={styles.rotateGuideIcon2} />
              </View>

              <View style={[styles.overlayItem, styles.overlayItemRight]}>
                <RotateGuideIcon fill="#ffffff" width={20} height={20} style={styles.rotateGuideIcon3} />
                <RotateGuideIcon fill="#ffffff" width={20} height={20} style={styles.rotateGuideIcon4} />
              </View>
            </Animated.View>

            <Text style={textStyle}>{value.text}</Text>
          </Animated.View>
        </GestureDetector>
      ) : (
        <View style={containerStyle}>
          <Pressable style={{padding: gestureSafeArea}} onPress={onPress}>
            <Text style={textStyle}>{value.text}</Text>
          </Pressable>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  overlay: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 20,
    padding: 5,
    backgroundColor: '#00000020'
  },
  overlayItem: {
    flex: 1,
    justifyContent: 'space-between'
  },
  overlayItemRight: {
    alignItems: 'flex-end'
  },
  rotateGuideIcon1: {
    transform: [{rotateZ: '-45deg'}]
  },
  rotateGuideIcon2: {
    transform: [{rotateZ: '-135deg'}]
  },
  rotateGuideIcon3: {
    transform: [{rotateZ: '45deg'}]
  },
  rotateGuideIcon4: {
    transform: [{rotateZ: '135deg'}]
  },
  text: {
    fontSize: 24,
    color: '#000'
  }
})

export default PhotoCardText
