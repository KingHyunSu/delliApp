import React from 'react'
import {LayoutChangeEvent, LayoutRectangle, StyleSheet, Pressable, View, Text} from 'react-native'

import {scheduleState} from '@/store/schedule'
import {useRecoilValue} from 'recoil'
import {polarToCartesian} from '../util'

import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle} from 'react-native-reanimated'

import MoveIcon from '@/assets/icons/move.svg'
import WidthlIcon from '@/assets/icons/width.svg'
import RotateIcon from '@/assets/icons/rotate.svg'

interface Props {
  centerX: number
  centerY: number
  radius: number
  statusBarHeight: number
  homeTopHeight: number
}
const InsertScheduleText = ({centerX, centerY, radius, statusBarHeight, homeTopHeight}: Props) => {
  const width = radius - radius / 3
  const padding = 5

  const schedule = useRecoilValue(scheduleState)

  const [containerLayout, setContainerLayout] = React.useState<LayoutRectangle | null>(null)

  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  const angle = React.useMemo(() => {
    const startAngle = schedule.start_time * 0.25
    let endAngle = schedule.end_time * 0.25

    if (endAngle < startAngle) {
      endAngle += 360
    }

    return startAngle + (endAngle - startAngle) / 2
  }, [schedule.start_time, schedule.end_time])

  React.useEffect(() => {
    const {x, y} = polarToCartesian(centerX - width / 2, centerY - 20, radius / 2, angle)

    setTop(y)
    setLeft(x)
  }, [centerX, centerY, radius, width, angle])

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    setContainerLayout(e.nativeEvent.layout)
  }

  const containerX = useSharedValue(0)
  const containerY = useSharedValue(0)
  const moveContainerX = useSharedValue(0)
  const moveContainerY = useSharedValue(0)

  const containerWidth = useSharedValue(0)
  const savedContainerWidth = useSharedValue(0)

  const rotate = useSharedValue(0)

  // handle move
  const moveGesture = Gesture.Pan()
    .onUpdate(e => {
      containerX.value = moveContainerX.value + e.translationX
      containerY.value = moveContainerY.value + e.translationY
    })
    .onEnd(e => {
      moveContainerX.value += e.translationX
      moveContainerY.value += e.translationY
    })
    .enabled(false)

  // handle size
  const sizeGesture = Gesture.Pan()
    .onUpdate(e => {
      containerWidth.value = savedContainerWidth.value + e.translationX
    })
    .onEnd(e => {
      savedContainerWidth.value += e.translationX
    })
    .enabled(true)

  // handle rotate
  const rotateGesture = Gesture.Pan().onUpdate(e => {
    if (containerLayout) {
      const anchorX = left + containerLayout.width
      const anchorY = top + (homeTopHeight - 100 + statusBarHeight) + containerLayout.height

      const rotateCenterX = left + containerLayout.width / 2
      const rotateCenterY = top + (homeTopHeight - 100 + statusBarHeight) + containerLayout.height / 2

      const moveX = e.absoluteX - rotateCenterX
      const moveY = e.absoluteY - rotateCenterY

      const anchorAngle = (Math.atan2(anchorY - rotateCenterY, anchorX - rotateCenterX) * 180) / Math.PI + 90
      const moveAngle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

      rotate.value = -(anchorAngle - moveAngle)
    }
  })

  const moveAnimatedStyle = useAnimatedStyle(() => ({
    top: top + containerY.value,
    left: left + containerX.value
  }))
  const sizeAnimatedStyle = useAnimatedStyle(() => ({
    width: width + containerWidth.value
  }))
  const rotateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${rotate.value}deg`}]
  }))

  if (!top && !left) {
    return <></>
  }
  return (
    <Animated.View
      style={[moveAnimatedStyle, sizeAnimatedStyle, rotateAnimatedStyle, styles.conatiner, {top: top, left: left}]}
      onLayout={handleContainerLayout}>
      <View style={styles.controlIconContainer}>
        <Pressable style={styles.controlIcon}>
          <MoveIcon width={18} height={18} stroke="#fff" />
        </Pressable>
        <Pressable style={styles.controlIcon}>
          <WidthlIcon width={18} height={18} fill="#fff" />
        </Pressable>
        <Pressable style={styles.controlIcon}>
          <RotateIcon width={18} height={18} stroke="#fff" />
        </Pressable>
      </View>

      <GestureDetector gesture={moveGesture}>
        <View
          style={[
            {
              paddingVertical: padding,
              paddingHorizontal: padding
            }
          ]}>
          <Text style={styles.text}>테스트 insert text</Text>
        </View>
      </GestureDetector>

      <GestureDetector gesture={sizeGesture}>
        <View style={styles.widthChangedBox}>
          <WidthlIcon />
        </View>
      </GestureDetector>

      <GestureDetector gesture={rotateGesture}>
        <View style={styles.rotateChangedBox}>
          <RotateIcon width={18} height={18} stroke="#000" />
        </View>
      </GestureDetector>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    position: 'absolute',
    minWidth: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BABABA'
  },
  controlIconContainer: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    top: -40
  },
  controlIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  widthChangedBox: {
    width: 24,
    height: '100%',
    position: 'absolute',
    right: -12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rotateChangedBox: {
    width: 36,
    height: 36,
    position: 'absolute',
    right: -18,
    bottom: -18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 14,
    color: '#000'
  }
})

export default InsertScheduleText
