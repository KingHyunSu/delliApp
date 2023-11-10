import React from 'react'
import {LayoutChangeEvent, LayoutRectangle, StyleSheet, Pressable, View, Text} from 'react-native'

import {polarToCartesian} from '../util'

import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

import MoveIcon from '@/assets/icons/move.svg'
import WidthlIcon from '@/assets/icons/width.svg'
import RotateIcon from '@/assets/icons/rotate.svg'

import {Schedule} from '@/types/schedule'

type Flag = 'MOVE' | 'SIZE' | 'ROTATE'

interface Props {
  data: Schedule
  centerX: number
  centerY: number
  radius: number
  statusBarHeight: number
  homeTopHeight: number
  isComponentEdit: boolean
  setIsComponentEdit: Function
  onChangeSchedule: Function
}
const InsertScheduleText = ({
  data,
  centerX,
  centerY,
  radius,
  statusBarHeight,
  homeTopHeight,
  isComponentEdit,
  setIsComponentEdit,
  onChangeSchedule
}: Props) => {
  const defaultWidth = radius - radius / 3
  const padding = 5

  const [flag, setFlag] = React.useState<Flag>('MOVE')
  const [containerLayout, setContainerLayout] = React.useState<LayoutRectangle | null>(null)

  const [width, setWidth] = React.useState(defaultWidth)
  const [top, setTop] = React.useState(0)
  const [left, setLeft] = React.useState(0)

  const angle = React.useMemo(() => {
    const startAngle = data.start_time * 0.25
    let endAngle = data.end_time * 0.25

    if (endAngle < startAngle) {
      endAngle += 360
    }

    return startAngle + (endAngle - startAngle) / 2
  }, [data.start_time, data.end_time])

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    setContainerLayout(e.nativeEvent.layout)
  }

  const containerX = useSharedValue(0)
  const containerY = useSharedValue(0)

  const containerWidth = useSharedValue(defaultWidth)

  const containerRotate = useSharedValue(data.title_rotate)

  // handle move
  const moveGesture = Gesture.Pan()
    .onUpdate(e => {
      containerX.value = left + e.translationX
      containerY.value = top + e.translationY
    })
    .onEnd(e => {
      runOnJS(setLeft)(left + e.translationX)
      runOnJS(setTop)(top + e.translationY)
    })
    .enabled(flag === 'MOVE')

  // handle size
  const sizeGesture = Gesture.Pan()
    .onUpdate(e => {
      containerWidth.value = width + e.translationX
    })
    .onEnd(e => {
      runOnJS(setWidth)(width + e.translationX)
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

      containerRotate.value = -Math.round(anchorAngle - moveAngle)
    }
  })

  const moveAnimatedStyle = useAnimatedStyle(() => ({
    top: containerY.value,
    left: containerX.value
  }))
  const sizeAnimatedStyle = useAnimatedStyle(() => ({
    width: containerWidth.value
  }))
  const rotateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${containerRotate.value}deg`}]
  }))

  React.useEffect(() => {
    const {x, y} = polarToCartesian(centerX - defaultWidth / 2, centerY - 20, radius / 2, angle)

    setTop(Math.round(y))
    setLeft(Math.round(x))
  }, [centerX, centerY, radius, defaultWidth, angle])

  React.useEffect(() => {
    const xPercentage = ((left - centerX) / radius) * 100
    const yPercentage = (((top - centerY) * -1) / radius) * 100

    onChangeSchedule({title_x: xPercentage, title_y: yPercentage})
  }, [top, left, centerX, centerY, radius, onChangeSchedule])

  React.useEffect(() => {
    onChangeSchedule({title_width: width})
  }, [width, onChangeSchedule])

  React.useEffect(() => {
    onChangeSchedule({title_rotate: containerRotate.value})
  }, [containerRotate.value, onChangeSchedule])

  if (!top && !left) {
    return <></>
  }
  if (!isComponentEdit) {
    return (
      <Pressable
        style={[styles.conatiner, {top: top, left: left}]}
        onPress={() => setIsComponentEdit(!isComponentEdit)}>
        <Text>{data.title}</Text>
      </Pressable>
    )
  }
  return (
    <Animated.View
      style={[moveAnimatedStyle, sizeAnimatedStyle, rotateAnimatedStyle, styles.conatiner, {top: top, left: left}]}
      onLayout={handleContainerLayout}>
      <View style={styles.controlIconContainer}>
        <Pressable
          style={[styles.controlIcon, flag === 'MOVE' && styles.activeControlIcon]}
          onPress={() => setFlag('MOVE')}>
          <MoveIcon width={18} height={18} stroke="#fff" />
        </Pressable>
        <Pressable
          style={[styles.controlIcon, flag === 'SIZE' && styles.activeControlIcon]}
          onPress={() => setFlag('SIZE')}>
          <WidthlIcon width={18} height={18} fill="#fff" />
        </Pressable>
        <Pressable
          style={[styles.controlIcon, flag === 'ROTATE' && styles.activeControlIcon]}
          onPress={() => setFlag('ROTATE')}>
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
          <Text style={styles.text}>{data.title}</Text>
        </View>
      </GestureDetector>

      {flag === 'SIZE' && (
        <GestureDetector gesture={sizeGesture}>
          <View style={styles.widthChangedBox}>
            <WidthlIcon />
          </View>
        </GestureDetector>
      )}

      {flag === 'ROTATE' && (
        <GestureDetector gesture={rotateGesture}>
          <View style={styles.rotateChangedBox}>
            <RotateIcon width={18} height={18} stroke="#000" />
          </View>
        </GestureDetector>
      )}
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
    backgroundColor: '#BABABA',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeControlIcon: {
    backgroundColor: '#1E90FF'
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
