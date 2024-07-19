import React from 'react'
import {Appearance, LayoutChangeEvent, StyleSheet, View, Pressable, Text} from 'react-native'

import {Gesture, GestureDetector, BaseButton, TextInput} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

import {useRecoilState} from 'recoil'
import {isInputModeState} from '@/store/schedule'
import {polarToCartesian} from '../util'

import TextRotationIcon1 from '@/assets/icons/text_rotation_none.svg'
import TextRotationIcon2 from '@/assets/icons/text_rotation_angleup.svg'
import TextRotationIcon3 from '@/assets/icons/text_rotation_down.svg'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
  onChangeSchedule: Function
}
const EditScheduleText = ({data, centerX, centerY, radius, onChangeSchedule}: Props) => {
  const containerPadding = 50

  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)

  const textInputRef = React.useRef<TextInput>(null)

  const [containerWidth, setContainerWidth] = React.useState(0)
  const [containerHeight, setContainerHeight] = React.useState(0)
  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  const containerX = useSharedValue(Math.round(centerX - containerPadding + (radius / 100) * data.title_x))
  const containerY = useSharedValue(Math.round(centerY - containerPadding - (radius / 100) * data.title_y))
  const containerRotate = useSharedValue(data.title_rotate)
  const conatinerSavedRotate = useSharedValue(0)

  React.useEffect(() => {
    if (isInputMode) {
      textInputRef.current?.focus()
    } else {
      textInputRef.current?.blur()
    }
  }, [isInputMode, textInputRef.current])

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
  }, [])

  const setTitlePosition = React.useCallback(
    (x: number, y: number) => {
      const xPercentage = Math.round(((x + containerPadding - centerX) / radius) * 100)
      const yPercentage = Math.round((((y + containerPadding - centerY) * -1) / radius) * 100)

      setLeft(x)
      setTop(y)

      changeSchedule({title_x: xPercentage, title_y: yPercentage})
    },
    [centerX, centerY, radius, changeSchedule]
  )

  const setTitleRotate = React.useCallback(
    (rotate: number) => {
      conatinerSavedRotate.value = rotate

      changeSchedule({title_rotate: rotate})
    },
    [conatinerSavedRotate, changeSchedule]
  )

  const getTitleRotateByControlType = React.useCallback((type: string, startTime: number, endTime: number) => {
    const centerAngle = (startTime + endTime) / 2

    switch (type) {
      case 'horizon':
        return 0
      case 'vertical':
        return 90
      case 'topRight':
        let textRotate = 90 - centerAngle

        if ((startTime > 180 && endTime > 180) || startTime > endTime) {
          textRotate = 180 + textRotate
        }

        return textRotate * -1
      default:
        return 0
    }
  }, [])

  const getTitleCenterPosition = React.useCallback(
    (startTime: number, endTime: number) => {
      let centerAngle = (startTime + endTime) / 2

      if (startTime > endTime) {
        centerAngle = (startTime + (endTime + 360)) / 2
      }

      return polarToCartesian(centerX - containerWidth / 2, centerY - containerHeight / 2, radius / 2, centerAngle)
    },
    [centerX, centerY, radius, containerWidth, containerHeight]
  )

  const handleTitleControl = React.useCallback(
    (type: string) => () => {
      const startTime = data.start_time * 0.25
      const endTime = data.end_time * 0.25

      const titleCenterPosition = getTitleCenterPosition(startTime, endTime)
      const titleRotate = getTitleRotateByControlType(type, startTime, endTime)

      containerX.value = titleCenterPosition.x
      containerY.value = titleCenterPosition.y
      containerRotate.value = titleRotate

      setTitlePosition(titleCenterPosition.x, titleCenterPosition.y)
      setTitleRotate(titleRotate)
    },
    [
      data.start_time,
      data.end_time,
      containerX,
      containerY,
      containerRotate,
      getTitleCenterPosition,
      getTitleRotateByControlType,
      setTitlePosition,
      setTitleRotate
    ]
  )

  const handleLayout = React.useCallback((e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout

    setContainerWidth(width)
    setContainerHeight(height)
  }, [])

  const moveGesture = Gesture.Pan()
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
    .onUpdate(e => {
      containerRotate.value = conatinerSavedRotate.value + (e.rotation / Math.PI) * 180
    })
    .onEnd(e => {
      const chagnedRotate = (e.rotation / Math.PI) * 180

      runOnJS(setTitleRotate)(chagnedRotate)
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
    return [positionStyle, rotateStyle, styles.conatiner, {padding: containerPadding}]
  }, [positionStyle, rotateStyle, containerPadding])

  const textStyle = React.useMemo(() => {
    let color = '#c3c5cc'

    if (data.title) {
      color = data.text_color
    }
    return [styles.text, {color}]
  }, [data.title, data.text_color])

  const title = React.useMemo(() => {
    if (data.title) {
      return data.title
    }

    return '일정명을 입력해주세요'
  }, [data.title])

  const toolContainerStyle = React.useMemo(() => {
    const systemColor = Appearance.getColorScheme()

    let backgroundColor = '#D2D4D9'
    let borderBottomColor = '#C0C2C6'

    if (systemColor === 'dark') {
      backgroundColor = '#6D6D6D'
      borderBottomColor = '#757575'
    }

    return [toolStyles.container, {backgroundColor, borderBottomColor}]
  }, [])

  const toolItemStyle = React.useMemo(() => {
    const systemColor = Appearance.getColorScheme()

    let backgroundColor = '#ffffff'

    if (systemColor === 'dark') {
      backgroundColor = '#969696'
    }

    return [toolStyles.item, {backgroundColor}]
  }, [])

  const toolIconColor = React.useMemo(() => {
    const systemColor = Appearance.getColorScheme()

    if (systemColor === 'dark') {
      return '#fcfcfc'
    }

    return '#000000'
  }, [])

  React.useEffect(() => {
    setLeft(containerX.value)
    setTop(containerY.value)
  }, [])

  return (
    <>
      <GestureDetector gesture={composeGesture}>
        <Animated.View style={containerStyle} onLayout={handleLayout}>
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

          {/*<View style={toolContainerStyle}>*/}
          {/*  <Pressable style={toolItemStyle} onPress={handleTitleControl('horizon')}>*/}
          {/*    <TextRotationIcon1 fill={toolIconColor} />*/}
          {/*  </Pressable>*/}
          {/*  <Pressable style={toolItemStyle} onPress={handleTitleControl('topRight')}>*/}
          {/*    <TextRotationIcon2 fill={toolIconColor} />*/}
          {/*  </Pressable>*/}
          {/*  <Pressable style={toolItemStyle} onPress={handleTitleControl('vertical')}>*/}
          {/*    <TextRotationIcon3 fill={toolIconColor} />*/}
          {/*  </Pressable>*/}
          {/*</View>*/}
        </Animated.View>
      </GestureDetector>
    </>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  textWrapper: {
    // minWidth: 40
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    paddingTop: 0,
    padding: 0
  }
})

const toolStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    borderBottomWidth: 1,
    height: 52,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  item: {
    height: 38,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default EditScheduleText
