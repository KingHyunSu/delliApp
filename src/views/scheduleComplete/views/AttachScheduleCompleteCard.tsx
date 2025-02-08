import {useState, useMemo, useCallback, useEffect} from 'react'
import {LayoutChangeEvent, StyleSheet, View, Text, Image, Pressable} from 'react-native'
import AppBar from '@/components/AppBar'
import {Timetable} from '@/components/TimeTable'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedStyle, runOnJS} from 'react-native-reanimated'

import {useRecoilState, useRecoilValue} from 'recoil'
import {activeBackgroundState, timetableWrapperSizeState} from '@/store/system'
import {scheduleListState} from '@/store/schedule'
import {useUpdateAttachScheduleCompleteCard} from '@/apis/hooks/useScheduleComplete'
import {AttachScheduleCompleteCardScreenProps} from '@/types/navigation'

const AttachScheduleCompleteCard = ({navigation, route}: AttachScheduleCompleteCardScreenProps) => {
  const gestureSafeArea = 50
  const cardWidth = 35
  const cardHeight = 35 * 1.25

  const {mutateAsync: updateAttachScheduleCompleteCardMutateAsync} = useUpdateAttachScheduleCompleteCard()

  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const activeBackground = useRecoilValue(activeBackgroundState)
  const timetableWrapperSize = useRecoilValue(timetableWrapperSizeState)

  const [limitMoveLeft, setLimitMoveLeft] = useState(0)
  const [limitMoveRight, setLimitMoveRight] = useState(0)
  const [limitMoveTop, setLimitMoveTop] = useState(0)
  const [limitMoveBottom, setLimitMoveBottom] = useState(0)
  const [savedX, setSavedX] = useState(0)
  const [savedY, setSavedY] = useState(0)
  const [xPercent, setXPercent] = useState(route.params.schedule_complete_card_x)
  const [yPercent, setYPercent] = useState(route.params.schedule_complete_card_y)

  const movedX = useSharedValue(0)
  const movedY = useSharedValue(0)

  const cardPositionStyle = useAnimatedStyle(() => ({
    top: movedY.value,
    left: movedX.value
  }))

  const cardWrapperStyle = useMemo(() => {
    return [cardPositionStyle, styles.cardWrapper, {padding: gestureSafeArea}]
  }, [])

  const activeSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === route.params.schedule_id)
  }, [scheduleList, route.params.schedule_id])

  const radius = useMemo(() => {
    return timetableWrapperSize - 40
  }, [timetableWrapperSize])

  const imageUri = useMemo(() => {
    const domain = process.env.CDN_URL
    return domain + '/' + route.params.schedule_complete_card_path
  }, [route.params.schedule_complete_card_path])

  const moveGesture = Gesture.Pan()
    .onBegin(() => {
      const _movedX = movedX.value
      const _moveY = movedY.value

      runOnJS(setSavedX)(_movedX)
      runOnJS(setSavedY)(_moveY)
    })
    .onUpdate(e => {
      const _savedX = savedX === null ? 0 : savedX
      const _savedY = savedY === null ? 0 : savedY
      let _movedX = Math.round(_savedX + e.translationX)
      let _movedY = Math.round(_savedY + e.translationY)

      if (_movedX <= limitMoveLeft) {
        _movedX = limitMoveLeft
      }
      if (_movedX >= limitMoveRight) {
        _movedX = limitMoveRight
      }
      if (_movedY <= limitMoveTop) {
        _movedY = limitMoveTop
      }
      if (_movedY >= limitMoveBottom) {
        _movedY = limitMoveBottom
      }

      movedX.value = _movedX
      movedY.value = _movedY
    })
    .onEnd(() => {
      const _movedX = movedX.value
      const _movedY = movedY.value
      const movedXPercent = Math.round(((_movedX + gestureSafeArea - radius) / radius) * 100)
      const movedYPercent = Math.round((((_movedY + gestureSafeArea - radius) * -1) / radius) * 100)

      runOnJS(setSavedX)(_movedX)
      runOnJS(setSavedY)(_movedY)

      runOnJS(setXPercent)(movedXPercent)
      runOnJS(setYPercent)(movedYPercent)
    })

  const handleTimetableLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const {layout} = e.nativeEvent

      setLimitMoveLeft(-gestureSafeArea)
      setLimitMoveRight(layout.width - cardWidth - gestureSafeArea)
      setLimitMoveTop(-gestureSafeArea)
      setLimitMoveBottom(layout.height - cardHeight)
    },
    [cardHeight]
  )

  const getNewScheduleList = useCallback(() => {
    return scheduleList.map(item => {
      if (item.schedule_id === route.params.schedule_id) {
        return {
          ...item,
          schedule_complete_card_x: xPercent,
          schedule_complete_card_y: yPercent
        }
      }
      return item
    })
  }, [scheduleList, xPercent, yPercent, route.params.schedule_id])

  const handleSubmit = useCallback(async () => {
    const response = await updateAttachScheduleCompleteCardMutateAsync({
      schedule_complete_id: route.params.schedule_complete_id,
      x: xPercent,
      y: yPercent
    })

    if (response.result) {
      navigation.navigate('MainTabs', {screen: 'Home'})

      const newScheduleList = getNewScheduleList()
      setScheduleList(newScheduleList)
    }
  }, [
    route.params.schedule_complete_id,
    xPercent,
    yPercent,
    navigation,
    getNewScheduleList,
    updateAttachScheduleCompleteCardMutateAsync,
    setScheduleList
  ])

  useEffect(() => {
    const x = route.params.schedule_complete_card_x
    const y = route.params.schedule_complete_card_y

    if (x === null && y === null) {
      movedX.value = Math.round(radius - gestureSafeArea - cardWidth / 2 + radius / 100)
      movedY.value = Math.round(radius - gestureSafeArea - radius / 100)
    } else {
      movedX.value = Math.round(radius - gestureSafeArea + (radius / 100) * x)
      movedY.value = Math.round(radius - gestureSafeArea - (radius / 100) * y)
    }
  }, [radius, route.params.schedule_complete_card_x, route.params.schedule_complete_card_y])

  const backgroundComponent = useMemo(() => {
    if (!activeBackground || activeBackground.background_id === 1) {
      return <Image style={styles.backgroundImage} source={require('@/assets/beige.png')} />
    }

    return <Image style={styles.backgroundImage} source={{uri: activeBackground.main_url}} />
  }, [activeBackground])

  return (
    <View style={[styles.container, {backgroundColor: activeBackground.background_color}]}>
      <AppBar backPress title="완료 카드 붙히기" color={activeBackground.accent_color} />

      <View style={{height: 36}} />

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        {backgroundComponent}

        <Timetable
          data={scheduleList}
          editScheduleCompleteCardId={route.params.schedule_complete_id}
          activeSchedule={activeSchedule}
        />

        <View style={{width: radius * 2, height: radius * 2, position: 'absolute'}} onLayout={handleTimetableLayout}>
          <GestureDetector gesture={moveGesture}>
            <Animated.View style={cardWrapperStyle}>
              <Image source={{uri: imageUri}} style={{width: cardWidth, height: cardHeight}} />

              <Image source={require('@/assets/images/tape.png')} style={styles.tape} />
            </Animated.View>
          </GestureDetector>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>완료</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  cardWrapper: {
    position: 'absolute',
    backgroundColor: '#00000020',
    borderRadius: 10
  },
  tape: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: 42,
    left: 60
  },
  button: {
    position: 'absolute',
    bottom: 15,
    left: 16,
    right: 16,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#ffffff'
  }
})

export default AttachScheduleCompleteCard
