import React from 'react'
import {StyleSheet, Modal, SafeAreaView, Pressable, View, Text} from 'react-native'
import TimeWheelPicker from '@/components/TimeWheelPicker'

import Animated, {runOnJS, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {useRecoilState, useRecoilValue} from 'recoil'
import {showScheduleCompleteModalState} from '@/store/modal'
import {scheduleState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'

import ArrowUpIcon from '@/assets/icons/arrow_up.svg'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'

const ScheduleCompleteModal = () => {
  const containerHeight = 600

  const [showScheduleCompleteModal, setShowScheduleCompleteModal] = useRecoilState(showScheduleCompleteModalState)
  const schedule = useRecoilValue(scheduleState)

  const [flag, setFlag] = React.useState(0)
  const [completeStartTime, setCompleteStartTime] = React.useState(0)
  const [completeEndTime, setCompleteEndTime] = React.useState(0)

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(completeStartTime)
  }, [completeStartTime])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(completeEndTime)
  }, [completeEndTime])

  const translateY = useSharedValue(containerHeight * -1)
  const opacity = useSharedValue(0)
  const startHeight = useSharedValue(260)
  const endHeight = useSharedValue(60)

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}]
  }))
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))
  const startHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: startHeight.value
  }))
  const endHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: endHeight.value
  }))

  const openStart = () => {
    if (startHeight.value === 260) {
      return
    }

    setFlag(0)

    startHeight.value = withTiming(260)
    endHeight.value = withTiming(60)
  }

  const openEnd = () => {
    if (endHeight.value === 260) {
      return
    }

    setFlag(1)

    startHeight.value = withTiming(60)
    endHeight.value = withTiming(260)
  }

  const handleClose = () => {
    opacity.value = withTiming(0)

    translateY.value = withTiming(containerHeight * -1, {duration: 300}, isFinish => {
      if (isFinish) {
        runOnJS(setShowScheduleCompleteModal)(false)
      }
    })
  }

  const changeStartTime = (time: number) => {
    setCompleteStartTime(time)
  }

  const changeEndTime = (time: number) => {
    if (time < completeStartTime) {
      setCompleteEndTime(completeStartTime)
    } else {
      setCompleteEndTime(time)
    }
  }

  React.useEffect(() => {
    if (showScheduleCompleteModal) {
      setCompleteStartTime(schedule.start_time)
      setCompleteEndTime(schedule.end_time)

      opacity.value = withTiming(1)
      translateY.value = withTiming(0)
    }
  }, [showScheduleCompleteModal])

  return (
    <Modal visible={showScheduleCompleteModal} transparent statusBarTranslucent>
      <Animated.View style={[overlayAnimatedStyle, styles.background]}>
        <Pressable style={styles.overlay} onPress={handleClose} />
      </Animated.View>

      <Animated.View style={[containerAnimatedStyle, styles.container, {height: containerHeight}]}>
        <SafeAreaView>
          <View style={styles.wrapper}>
            <View>
              <Text style={styles.title}>일정 완료하기</Text>

              <View style={styles.timeWheelContainer}>
                <Animated.View style={[startHeightAnimatedStyle, styles.timeWheelSection]}>
                  <Pressable style={styles.timeWheelWrapper} onPress={openStart}>
                    <Text style={styles.timeWheelLabel}>시작 시간</Text>

                    <View style={styles.timeWheelTimeWrapper}>
                      <Text style={styles.timeWheelText}>
                        {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분`}
                      </Text>
                      {flag === 0 ? <ArrowUpIcon stroke="#000" /> : <ArrowDownIcon stroke="#000" />}
                    </View>
                  </Pressable>

                  <View style={styles.wheelContainer}>
                    <TimeWheelPicker initValue={schedule.start_time} visibleRest={1} onChange={changeStartTime} />
                  </View>
                </Animated.View>

                <Animated.View style={[endHeightAnimatedStyle, styles.timeWheelSection]}>
                  <Pressable style={styles.timeWheelWrapper} onPress={openEnd}>
                    <Text style={styles.timeWheelLabel}>종료 시간</Text>

                    <View style={styles.timeWheelTimeWrapper}>
                      <Text style={styles.timeWheelText}>
                        {`${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}
                      </Text>
                      {flag === 1 ? <ArrowUpIcon stroke="#000" /> : <ArrowDownIcon stroke="#000" />}
                    </View>
                  </Pressable>

                  <View style={styles.wheelContainer}>
                    <TimeWheelPicker initValue={schedule.end_time} visibleRest={1} onChange={changeEndTime} />
                  </View>
                </Animated.View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.closeButton]} onPress={handleClose}>
                <Text style={styles.buttonText}>닫기</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.confirmButton]}>
                <Text style={styles.buttonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    height: '100%',
    justifyContent: 'space-between'
  },
  overlay: {
    flex: 1
  },
  title: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 40
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#7c8698'
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#2d8cec'
  },
  buttonText: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 16,
    color: '#fff'
  },

  timeWheelContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eeeded',
    marginTop: 20
  },
  timeWheelSection: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded',
    overflow: 'hidden'
  },
  timeWheelWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center'
  },
  timeWheelTimeWrapper: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  timeWheelLabel: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 14,
    color: '#BABABA'
  },
  timeWheelText: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 14,
    color: '#000'
  },

  wheelContainer: {
    height: 200
  }
})

export default ScheduleCompleteModal
