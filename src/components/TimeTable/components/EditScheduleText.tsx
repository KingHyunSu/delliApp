import React from 'react'
import {StyleSheet, View} from 'react-native'

import {Gesture, GestureDetector, TextInput} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS, withTiming} from 'react-native-reanimated'

import {useRecoilState} from 'recoil'
import {isInputModeState} from '@/store/schedule'

import RotateGuideIcon from '@/assets/icons/rotate_guide.svg'

interface Props {
  data: Schedule
  isRendered: boolean
  centerX: number
  centerY: number
  radius: number
  onChangeSchedule: Function
}
const EditScheduleText = ({data, isRendered, centerX, centerY, radius, onChangeSchedule}: Props) => {
  const gestureHorizontalSafeArea = 70
  const gestureVerticalSafeArea = 100

  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)

  const textInputRef = React.useRef<TextInput>(null)

  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  const containerX = useSharedValue(Math.round(centerX - gestureHorizontalSafeArea + (radius / 100) * data.title_x))
  const containerY = useSharedValue(Math.round(centerY - gestureVerticalSafeArea - (radius / 100) * data.title_y))
  const containerRotate = useSharedValue(data.title_rotate)
  const containerSavedRotate = useSharedValue(data.title_rotate)
  const opacity = useSharedValue(0)

  React.useEffect(() => {
    if (isInputMode) {
      textInputRef.current?.focus()
    } else {
      textInputRef.current?.blur()
    }
  }, [isInputMode, textInputRef])

  const changeSchedule = React.useCallback(
    (value: Object) => {
      onChangeSchedule(value)
    },
    [onChangeSchedule]
  )

  const changeTitle = React.useCallback(
    (value: string) => {
      changeSchedule({title: value})
    },
    [changeSchedule]
  )

  const handleFocus = React.useCallback(() => {
    setIsInputMode(true)
  }, [setIsInputMode])

  const setTitlePosition = React.useCallback(
    (x: number, y: number) => {
      const xPercentage = Math.round(((x + gestureHorizontalSafeArea - centerX) / radius) * 100)
      const yPercentage = Math.round((((y + gestureVerticalSafeArea - centerY) * -1) / radius) * 100)

      setLeft(x)
      setTop(y)

      changeSchedule({title_x: xPercentage, title_y: yPercentage})
    },
    [centerX, centerY, radius, changeSchedule]
  )

  const setTitleRotate = React.useCallback(
    (rotate: number) => {
      changeSchedule({title_rotate: rotate})
    },
    [changeSchedule]
  )

  const moveGesture = Gesture.Pan()
    .enabled(isInputMode as boolean)
    .enableTrackpadTwoFingerGesture(true)
    .onUpdate(e => {
      containerX.value = Math.round(left + e.translationX)
      containerY.value = Math.round(top + e.translationY)
    })
    .onEnd(() => {
      const changedX = containerX.value
      const changedY = containerY.value

      runOnJS(setTitlePosition)(changedX, changedY)
    })

  const rotateGesture = Gesture.Rotation()
    .enabled(isInputMode as boolean)
    .onUpdate(e => {
      containerRotate.value = containerSavedRotate.value + (e.rotation / Math.PI) * 180
    })
    .onEnd(e => {
      const rotate = containerSavedRotate.value + (e.rotation / Math.PI) * 180

      containerSavedRotate.value = rotate
      runOnJS(setTitleRotate)(rotate)
    })

  const composeGesture = Gesture.Simultaneous(moveGesture, rotateGesture)

  const positionStyle = useAnimatedStyle(() => {
    return {
      top: containerY.value,
      left: containerX.value
    }
  })

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${containerRotate.value}deg`}]
    }
  })

  const containerStyle = React.useMemo(() => {
    return [
      positionStyle,
      rotateStyle,
      styles.container,
      {paddingVertical: gestureVerticalSafeArea, paddingHorizontal: gestureHorizontalSafeArea}
    ]
  }, [positionStyle, rotateStyle])

  const overlayStyle = useAnimatedStyle(() => ({
    ...styles.overlay,
    opacity: opacity.value
  }))

  const textStyle = React.useMemo(() => {
    let color = '#424242'

    if (data.title) {
      color = data.text_color
    }
    return [styles.text, {color}]
  }, [data.title, data.text_color])

  React.useEffect(() => {
    setLeft(containerX.value)
    setTop(containerY.value)
  }, [])

  React.useEffect(() => {
    if (isRendered && isInputMode) {
      opacity.value = withTiming(1)
    } else {
      opacity.value = withTiming(0)
    }
  }, [isRendered, isInputMode])

  return (
    <>
      <GestureDetector gesture={composeGesture}>
        <Animated.View style={containerStyle}>
          <Animated.View style={overlayStyle}>
            <View style={styles.overlayItem}>
              <RotateGuideIcon fill="#ffffff" width={24} height={24} style={styles.rotateGuideIcon1} />
              <RotateGuideIcon fill="#ffffff" width={24} height={24} style={styles.rotateGuideIcon2} />
            </View>

            <View style={[styles.overlayItem, styles.overlayItemRight]}>
              <RotateGuideIcon fill="#ffffff" width={24} height={24} style={styles.rotateGuideIcon3} />
              <RotateGuideIcon fill="#ffffff" width={24} height={24} style={styles.rotateGuideIcon4} />
            </View>
          </Animated.View>

          <TextInput
            ref={textInputRef}
            value={data.title}
            style={textStyle}
            maxLength={200}
            multiline
            scrollEnabled={false}
            onChangeText={changeTitle}
            onFocus={handleFocus}
            placeholder="일정명을 입력해주세요"
            placeholderTextColor="#c3c5cc"
          />
        </Animated.View>
      </GestureDetector>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center'
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
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    minWidth: 150,
    minHeight: 28,
    paddingTop: 0
  }
})

export default EditScheduleText
