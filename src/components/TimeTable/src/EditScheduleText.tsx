import React from 'react'
import {StyleSheet, View, Pressable, Text, TextInput, InputAccessoryView} from 'react-native'

import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

import {useRecoilState} from 'recoil'
import {isInputModeState} from '@/store/schedule'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
  onChangeSchedule: Function
}
const EditScheduleText = ({data, centerX, centerY, radius, onChangeSchedule}: Props) => {
  const inputAccessoryViewID = 'scheduleTitle'
  const containerPadding = 50

  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)

  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  const containerX = useSharedValue(Math.round(centerX - containerPadding + (radius / 100) * data.title_x))
  const containerY = useSharedValue(Math.round(centerY - containerPadding - (radius / 100) * data.title_y))
  const containerRotate = useSharedValue(data.title_rotate)
  const conatinerSavedRotate = useSharedValue(0)

  const handleInputMode = React.useCallback(() => {
    setIsInputMode(true)
  }, [setIsInputMode])

  const handleFocus = React.useCallback(() => {}, [])

  const handleBlur = React.useCallback(() => {
    setIsInputMode(false)
  }, [setIsInputMode])

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

  const moveGesture = Gesture.Pan()
    .enableTrackpadTwoFingerGesture(true)
    .onUpdate(e => {
      containerX.value = Math.round(left + e.translationX)
      containerY.value = Math.round(top + e.translationY)
    })
    .onEnd(() => {
      const changedX = containerX.value
      const changedY = containerY.value

      const xPercentage = Math.round(((changedX + containerPadding - centerX) / radius) * 100)
      const yPercentage = Math.round((((changedY + containerPadding - centerY) * -1) / radius) * 100)

      runOnJS(setLeft)(changedX)
      runOnJS(setTop)(changedY)

      runOnJS(changeSchedule)({title_x: xPercentage, title_y: yPercentage})
    })

  const rotateGesture = Gesture.Rotation()
    .onUpdate(e => {
      containerRotate.value = conatinerSavedRotate.value + (e.rotation / Math.PI) * 180
    })
    .onEnd(e => {
      const chagnedRotate = (e.rotation / Math.PI) * 180

      conatinerSavedRotate.value = chagnedRotate

      runOnJS(changeSchedule)({title_rotate: chagnedRotate})
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

  React.useEffect(() => {
    setLeft(containerX.value)
    setTop(containerY.value)
  }, [])

  return (
    <>
      <GestureDetector gesture={composeGesture}>
        <Animated.View style={containerStyle}>
          {isInputMode ? (
            <TextInput
              value={data.title}
              inputAccessoryViewID={inputAccessoryViewID}
              style={textStyle}
              maxLength={20}
              multiline
              autoFocus
              scrollEnabled={false}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={changeTitle}
            />
          ) : (
            <Pressable style={styles.textWrapper} onPress={handleInputMode}>
              <Text style={textStyle}>{title}</Text>
            </Pressable>
          )}
        </Animated.View>
      </GestureDetector>

      {/* todo 2차 기능 */}
      {/* <InputAccessoryView nativeID={inputAccessoryViewID}>
        <View style={toolStyles.container}>
          <Pressable style={toolStyles.item}>
            <Text>/</Text>
          </Pressable>
          <Pressable style={toolStyles.item}>
            <Text>-</Text>
          </Pressable>
        </View>
      </InputAccessoryView> */}
    </>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    position: 'absolute'
  },
  textWrapper: {
    borderColor: 'transparent',
    borderStyle: 'dashed',
    borderRadius: 5
  },
  text: {
    paddingTop: 0,
    padding: 0,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000'
  }
})

const toolStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D2D4D9',
    borderBottomWidth: 1,
    borderBottomColor: '#C0C2C6',
    backgroundColor: '#D2D4D9'
  },
  item: {
    width: 80,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default EditScheduleText
