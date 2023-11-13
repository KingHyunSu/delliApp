// import React from 'react'
// import {LayoutChangeEvent, LayoutRectangle, StyleSheet, Pressable, View, Text} from 'react-native'

// import {polarToCartesian} from '../util'

// import {Gesture, GestureDetector} from 'react-native-gesture-handler'
// import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

// import MoveIcon from '@/assets/icons/move.svg'
// import WidthlIcon from '@/assets/icons/width.svg'
// import RotateIcon from '@/assets/icons/rotate.svg'

// import {Schedule} from '@/types/schedule'

// type Flag = 'MOVE' | 'SIZE' | 'ROTATE'

// interface Props {
//   data: Schedule
//   centerX: number
//   centerY: number
//   radius: number
//   statusBarHeight: number
//   homeTopHeight: number
//   isComponentEdit: boolean
//   setIsComponentEdit: Function
//   onChangeSchedule: Function
// }
// const InsertScheduleText = ({
//   data,
//   centerX,
//   centerY,
//   radius,
//   statusBarHeight,
//   homeTopHeight,
//   isComponentEdit,
//   setIsComponentEdit,
//   onChangeSchedule
// }: Props) => {
//   const [flag, setFlag] = React.useState<Flag>('MOVE')
//   const [containerLayout, setContainerLayout] = React.useState<LayoutRectangle | null>(null)

//   const [width, setWidth] = React.useState(0)
//   const [top, setTop] = React.useState(0)
//   const [left, setLeft] = React.useState(0)

//   const angle = React.useMemo(() => {
//     const startAngle = data.start_time * 0.25
//     let endAngle = data.end_time * 0.25

//     if (endAngle < startAngle) {
//       endAngle += 360
//     }

//     return startAngle + (endAngle - startAngle) / 2
//   }, [data.start_time, data.end_time])

//   const handleContainerLayout = (e: LayoutChangeEvent) => {
//     setContainerLayout(e.nativeEvent.layout)
//   }

//   const changeSchedule = (data: Object) => {
//     onChangeSchedule(data)
//   }

//   const containerX = useSharedValue(0)
//   const containerY = useSharedValue(0)

//   const containerWidth = useSharedValue(0)

//   const containerRotate = useSharedValue(data.title_rotate)

//   // handle move
//   const moveGesture = Gesture.Pan()
//     .onUpdate(e => {
//       containerX.value = left + e.translationX
//       containerY.value = top + e.translationY
//     })
//     .onEnd(e => {
//       const changedX = containerX.value
//       const changedY = containerY.value

//       const xPercentage = ((changedX - centerX) / radius) * 100
//       const yPercentage = (((changedY - centerY) * -1) / radius) * 100

//       runOnJS(setLeft)(changedX)
//       runOnJS(setTop)(changedY)

//       runOnJS(changeSchedule)({title_x: xPercentage, title_y: yPercentage})
//     })
//     .enabled(flag === 'MOVE')

//   // handle size
//   const sizeGesture = Gesture.Pan()
//     .onUpdate(e => {
//       containerWidth.value = width + e.translationX
//     })
//     .onEnd(e => {
//       const changedWidth = width + e.translationX

//       runOnJS(setWidth)(changedWidth)

//       runOnJS(changeSchedule)({title_width: changedWidth})
//     })
//     .enabled(true)

//   // handle rotate
//   const rotateGesture = Gesture.Pan().onUpdate(e => {
//     if (containerLayout) {
//       const anchorX = left + containerLayout.width
//       const anchorY = top + (homeTopHeight - 100 + statusBarHeight) + containerLayout.height

//       const rotateCenterX = left + containerLayout.width / 2
//       const rotateCenterY = top + (homeTopHeight - 100 + statusBarHeight) + containerLayout.height / 2

//       const moveX = e.absoluteX - rotateCenterX
//       const moveY = e.absoluteY - rotateCenterY

//       const anchorAngle = (Math.atan2(anchorY - rotateCenterY, anchorX - rotateCenterX) * 180) / Math.PI + 90
//       const moveAngle = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90

//       const changedRotate = -Math.round(anchorAngle - moveAngle)

//       containerRotate.value = changedRotate

//       runOnJS(changeSchedule)({title_rotate: changedRotate})
//     }
//   })

//   const moveAnimatedStyle = useAnimatedStyle(() => ({
//     top: containerY.value,
//     left: containerX.value
//   }))
//   const sizeAnimatedStyle = useAnimatedStyle(() => ({
//     width: containerWidth.value
//   }))
//   const rotateAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{rotateZ: `${containerRotate.value}deg`}]
//   }))

//   React.useEffect(() => {
//     const defaultWidth = radius - radius / 3

//     const {x, y} = polarToCartesian(centerX, centerY - 13, radius / 3, angle)

//     let changedWidth = defaultWidth
//     let changedY = Math.round(y)
//     let changedX = Math.round(x)

//     if (data.schedule_id) {
//       changedWidth = data.title_width
//       changedY = centerY - (radius / 100) * data.title_y
//       changedX = centerX + (radius / 100) * data.title_x
//     }

//     setWidth(changedWidth)
//     setLeft(changedX / 2)
//     setTop(changedY)

//     containerWidth.value = changedWidth
//     containerX.value = changedX / 2
//     containerY.value = changedY
//   }, [])

//   if (!top && !left) {
//     return <></>
//   }
//   if (!isComponentEdit) {
//     return (
//       <Pressable
//         style={[styles.conatiner, {width, top, left, transform: [{rotateZ: `${data.title_rotate}deg`}]}]}
//         onPress={() => setIsComponentEdit(!isComponentEdit)}>
//         <Text style={styles.text}>{data.title}</Text>
//       </Pressable>
//     )
//   }
//   return (
//     <Animated.View
//       style={[moveAnimatedStyle, sizeAnimatedStyle, rotateAnimatedStyle, styles.conatiner]}
//       onLayout={handleContainerLayout}>
//       <View style={styles.controlIconContainer}>
//         <Pressable
//           style={[styles.controlIcon, flag === 'MOVE' && styles.activeControlIcon]}
//           onPress={() => setFlag('MOVE')}>
//           <MoveIcon width={18} height={18} stroke="#fff" />
//         </Pressable>
//         <Pressable
//           style={[styles.controlIcon, flag === 'SIZE' && styles.activeControlIcon]}
//           onPress={() => setFlag('SIZE')}>
//           <WidthlIcon width={18} height={18} fill="#fff" />
//         </Pressable>
//         <Pressable
//           style={[styles.controlIcon, flag === 'ROTATE' && styles.activeControlIcon]}
//           onPress={() => setFlag('ROTATE')}>
//           <RotateIcon width={18} height={18} stroke="#fff" />
//         </Pressable>
//       </View>

//       <GestureDetector gesture={moveGesture}>
//         <View>
//           <Text style={styles.text}>{data.title}</Text>
//         </View>
//       </GestureDetector>

//       {flag === 'SIZE' && (
//         <GestureDetector gesture={sizeGesture}>
//           <View style={styles.widthChangedBox}>
//             <WidthlIcon />
//           </View>
//         </GestureDetector>
//       )}

//       {flag === 'ROTATE' && (
//         <GestureDetector gesture={rotateGesture}>
//           <View style={styles.rotateChangedBox}>
//             <RotateIcon width={18} height={18} stroke="#000" />
//           </View>
//         </GestureDetector>
//       )}
//     </Animated.View>
//   )
// }

// const styles = StyleSheet.create({
//   conatiner: {
//     position: 'absolute',
//     minWidth: 40,
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: '#BABABA',
//     padding: 5
//   },
//   controlIconContainer: {
//     flexDirection: 'row',
//     gap: 10,
//     position: 'absolute',
//     top: -40
//   },
//   controlIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#BABABA',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   activeControlIcon: {
//     backgroundColor: '#1E90FF'
//   },
//   widthChangedBox: {
//     width: 24,
//     height: '100%',
//     position: 'absolute',
//     right: -12,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   rotateChangedBox: {
//     width: 36,
//     height: 36,
//     position: 'absolute',
//     right: -18,
//     bottom: -18,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   text: {
//     fontFamily: 'GmarketSansTTFMedium',
//     fontSize: 14,
//     color: '#000'
//   }
// })

// export default InsertScheduleText
