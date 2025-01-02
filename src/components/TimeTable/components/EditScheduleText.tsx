import React, {useEffect, useMemo} from 'react'
import {LayoutChangeEvent, StyleSheet, View} from 'react-native'

import {Gesture, GestureDetector, TextInput} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS, withTiming} from 'react-native-reanimated'

import {useRecoilState, useRecoilValue} from 'recoil'
import {keyboardAppearanceState} from '@/store/system'
import {editScheduleTimeState, isInputModeState} from '@/store/schedule'

import RotateGuideIcon from '@/assets/icons/rotate_guide.svg'
import {polarToCartesian} from '@/utils/pieHelper'
import AlignLeftIcon from '@/assets/icons/align_left.svg'
import AlignCenterIcon from '@/assets/icons/align_center.svg'
import AlignRightIcon from '@/assets/icons/align_right.svg'
import AlignJustifyIcon from '@/assets/icons/align_justify.svg'

interface Props {
  data: EditScheduleForm
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

  const keyboardAppearance = useRecoilValue(keyboardAppearanceState)
  const editScheduleTime = useRecoilValue(editScheduleTimeState)

  const textInputRef = React.useRef<TextInput>(null)

  const [titleLayout, setTitleLayout] = React.useState<{width: number; height: number}>({
    width: 0,
    height: 0
  })
  const [savedX, setSavedX] = React.useState(0)
  const [savedY, setSavedY] = React.useState(0)

  const movedX = useSharedValue(Math.round(centerX - gestureHorizontalSafeArea + (radius / 100) * data.title_x))
  const movedY = useSharedValue(Math.round(centerY - gestureVerticalSafeArea - (radius / 100) * data.title_y))
  const containerRotate = useSharedValue(data.title_rotate)
  const containerSavedRotate = useSharedValue(data.title_rotate)
  const opacity = useSharedValue(0)

  const positionStyle = useAnimatedStyle(() => {
    return {
      top: movedY.value,
      left: movedX.value
    }
  })

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${containerRotate.value}deg`}]
    }
  })

  const titleKey = React.useMemo(() => {
    return `${data.font_size}${data.text_color}`
  }, [data.font_size, data.text_color])

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
    return [styles.text, {color, fontSize: data.font_size}]
  }, [data.title, data.text_color, data.font_size])

  const handleFocus = React.useCallback(() => {
    setIsInputMode(true)
  }, [setIsInputMode])

  const changeTitle = React.useCallback(
    (value: string) => {
      onChangeSchedule({title: value})
    },
    [onChangeSchedule]
  )

  const setTitlePosition = React.useCallback(
    (x: number, y: number) => {
      const xPercentage = Math.round(((x + gestureHorizontalSafeArea - centerX) / radius) * 100)
      const yPercentage = Math.round((((y + gestureVerticalSafeArea - centerY) * -1) / radius) * 100)

      onChangeSchedule({title_x: xPercentage, title_y: yPercentage})
    },
    [centerX, centerY, radius, onChangeSchedule]
  )

  const setTitleRotate = React.useCallback(
    (rotate: number) => {
      onChangeSchedule({title_rotate: rotate})
    },
    [onChangeSchedule]
  )

  const changeTitleBoundingBox = React.useCallback((e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout
    setTitleLayout({width, height})
  }, [])

  const handleFontAngleChanged = React.useCallback(() => {
    if (data.font_align !== 0) {
      onChangeSchedule({font_align: 0})
    }
  }, [data.font_align, onChangeSchedule])

  const moveGesture = Gesture.Pan()
    .enabled(isInputMode as boolean)
    .enableTrackpadTwoFingerGesture(true)
    .onBegin(e => {
      const _movedX = movedX.value
      const _moveY = movedY.value

      runOnJS(setSavedX)(_movedX)
      runOnJS(setSavedY)(_moveY)
    })
    .onUpdate(e => {
      movedX.value = Math.round(savedX + e.translationX)
      movedY.value = Math.round(savedY + e.translationY)

      runOnJS(handleFontAngleChanged)()
    })
    .onEnd(() => {
      const _movedX = movedX.value
      const _moveY = movedY.value

      runOnJS(setSavedX)(_movedX)
      runOnJS(setSavedY)(_moveY)

      runOnJS(setTitlePosition)(_movedX, _moveY)
      runOnJS(handleFontAngleChanged)()
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

  useEffect(() => {
    if (data.font_align !== 0) {
      const startAngle = editScheduleTime.start * 0.25
      const endAngle = editScheduleTime.end * 0.25
      let centerAngle = (startAngle + endAngle) / 2
      if (endAngle < startAngle) {
        centerAngle = startAngle + (360 - startAngle + endAngle) / 2
      }

      let _radius = 0

      if (data.font_align === 1) {
        _radius = titleLayout.width / 2 + 20
      } else if (data.font_align === 2) {
        _radius = radius / 2
      } else if (data.font_align === 3) {
        _radius = radius - titleLayout.width / 2 - 10
      }

      const cartesian = polarToCartesian(centerX, centerY, _radius, centerAngle)

      const _moveXPercent = Math.round(((cartesian.x - centerX - titleLayout.width / 2) / radius) * 100)
      const _moveYPercent = Math.round((((cartesian.y - centerY - titleLayout.height / 2) * -1) / radius) * 100)
      const _moveX = Math.round(centerX - gestureHorizontalSafeArea + (radius / 100) * _moveXPercent)
      const _moveY = Math.round(centerY - gestureVerticalSafeArea - (radius / 100) * _moveYPercent)
      const _rotate = centerAngle - 90

      movedX.value = _moveX
      movedY.value = _moveY
      containerRotate.value = _rotate

      setSavedX(_moveX)
      setSavedY(_moveY)
      containerSavedRotate.value = _rotate

      onChangeSchedule({
        title_x: _moveXPercent,
        title_y: _moveYPercent,
        title_rotate: _rotate
      })
    }
  }, [
    movedX,
    movedY,
    containerRotate,
    containerSavedRotate,
    editScheduleTime.start,
    editScheduleTime.end,
    titleLayout.width,
    titleLayout.height,
    data.font_align,
    centerX,
    centerY,
    radius,
    onChangeSchedule
  ])

  React.useEffect(() => {
    if (isInputMode) {
      textInputRef.current?.focus()
    } else {
      textInputRef.current?.blur()
    }
  }, [isInputMode, textInputRef])

  React.useEffect(() => {
    if (isRendered && isInputMode) {
      opacity.value = withTiming(1)
    } else {
      opacity.value = withTiming(0)
    }
  }, [isRendered, isInputMode])

  const activeFontAlignIcon = useMemo(() => {
    switch (data.font_align) {
      case 1:
        return <AlignLeftIcon width={20} height={20} fill="#ffffff" />
      case 2:
        return <AlignCenterIcon width={20} height={20} fill="#ffffff" />
      case 3:
        return <AlignRightIcon width={20} height={20} fill="#ffffff" />
      default:
        return <AlignJustifyIcon width={20} height={20} fill="#ffffff" />
    }
  }, [data.font_align])

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

            <View style={{position: 'absolute', top: 50, left: 0, right: 0, alignItems: 'center'}}>
              {activeFontAlignIcon}
            </View>
          </Animated.View>

          <TextInput
            key={titleKey}
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
            keyboardAppearance={keyboardAppearance}
            onLayout={changeTitleBoundingBox}
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
    // minWidth: 150,
    // minHeight: 28,
    paddingTop: 0
  }
})

export default EditScheduleText
