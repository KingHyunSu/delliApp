import React from 'react'
import {StyleSheet, Modal, Pressable, View, Text} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

import WheelPicker from '@/components/WheelPicker'

import {useRecoilState} from 'recoil'
import {showTimeWheelModalState} from '@/store/modal'
import {scheduleState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'

type Tab = 'START' | 'END'

const visibleRest = 2
const meridiemList = ['오전', '오후']
// prettier-ignore
const hourList = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
// prettier-ignore
const minuteList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

const TimeWheel = () => {
  const [showTimeWheelModal, setShowTimeWheelModal] = useRecoilState(showTimeWheelModalState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const [startTime, setStartTime] = React.useState(0)
  const [endTime, setEndTime] = React.useState(0)
  const [activeTab, setActiveTab] = React.useState<Tab>('START')
  const [meridiemIndex, setMeridiemIndex] = React.useState(0)
  const [hourIndex, setHourIndex] = React.useState(0)
  const [minuteIndex, setMinuteIndex] = React.useState(0)

  const opacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const backgroundStyle = React.useMemo(() => {
    return [styles.background, animatedStyle]
  }, [])

  const startTimeFormat = React.useMemo(() => {
    return getTimeOfMinute(startTime)
  }, [startTime])

  const endTimeFormat = React.useMemo(() => {
    return getTimeOfMinute(endTime)
  }, [endTime])

  const activeStartTab = React.useMemo(() => {
    if (activeTab === 'START') {
      return {
        borderBottomColor: '#424242'
      }
    }
    return null
  }, [activeTab])

  const activeStartText = React.useMemo(() => {
    if (activeTab === 'START') {
      return {
        color: '#424242',
        fontFamily: 'Pretendard-SemiBold'
      }
    }
  }, [activeTab])

  const activeEndTab = React.useMemo(() => {
    if (activeTab === 'END') {
      return {
        borderBottomColor: '#424242'
      }
    }
    return null
  }, [activeTab])

  const activeEndText = React.useMemo(() => {
    if (activeTab === 'END') {
      return {
        color: '#424242',
        fontFamily: 'Pretendard-SemiBold'
      }
    }
  }, [activeTab])

  const onChange = React.useCallback(
    (time: number) => {
      if (activeTab === 'START') {
        setStartTime(time)
      } else if (activeTab === 'END') {
        setEndTime(time)
      }
    },
    [activeTab]
  )

  const changeTab = React.useCallback(
    (type: Tab) => () => {
      setActiveTab(type)
    },
    []
  )

  const handleMeridiemChanged = React.useCallback(
    (index: number) => {
      const hourToMinute = (hourIndex + index * 12) * 60
      const result = hourToMinute + minuteIndex

      onChange(result)
    },
    [hourIndex, minuteIndex, onChange]
  )

  const handleHourChanged = React.useCallback(
    (index: number) => {
      const hourToMinute = (index + meridiemIndex * 12) * 60
      const result = hourToMinute + minuteIndex

      onChange(result)
    },
    [meridiemIndex, minuteIndex, onChange]
  )

  const handleMinuteChanged = React.useCallback(
    (index: number) => {
      const hourToMinute = (hourIndex + meridiemIndex * 12) * 60
      const result = hourToMinute + index

      onChange(result)
    },
    [hourIndex, meridiemIndex, onChange]
  )

  const handleClose = React.useCallback(() => {
    // 종료일에서 닫으면 스크롤 안보이는 이슈 때문에 추가
    setStartTime(schedule.start_time)
    setActiveTab('START')

    setShowTimeWheelModal(false)
  }, [setShowTimeWheelModal, schedule.start_time])

  const handleConfirm = React.useCallback(() => {
    setSchedule(prevState => ({
      ...prevState,
      start_time: startTime,
      end_time: endTime
    }))

    // 종료일에서 닫으면 스크롤 안보이는 이슈 때문에 추가
    setActiveTab('START')

    setShowTimeWheelModal(false)
  }, [setSchedule, startTime, endTime])

  const changeTime = (time: number) => {
    let meridie = 0
    let hour = Math.floor(time / 60)
    const minute = time % 60

    if (time >= 720) {
      meridie = 1
      hour -= 12
    }

    setMeridiemIndex(meridie)
    setHourIndex(hour)
    setMinuteIndex(minute)
  }

  React.useEffect(() => {
    if (showTimeWheelModal) {
      setStartTime(schedule.start_time)
      setEndTime(schedule.end_time)
      opacity.value = withTiming(1, {duration: 150})
    } else {
      opacity.value = 0
    }
  }, [showTimeWheelModal, schedule.start_time, schedule.end_time])

  React.useEffect(() => {
    if (activeTab === 'START') {
      changeTime(startTime)
    } else if (activeTab === 'END') {
      changeTime(endTime)
    }
  }, [activeTab, startTime, endTime])

  return (
    <Modal visible={showTimeWheelModal} hardwareAccelerated transparent statusBarTranslucent>
      <Animated.View style={backgroundStyle}>
        <Pressable style={styles.overlay} />

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.tabContainer}>
              <Pressable style={[styles.tabButton, activeStartTab]} onPress={changeTab('START')}>
                <Text style={[styles.tabText, activeStartText]}>시작일</Text>
                <Text style={styles.tabText}>
                  {`${startTimeFormat.meridiem} ${startTimeFormat.hour}시 ${startTimeFormat.minute}분`}
                </Text>
              </Pressable>

              <Pressable style={[styles.tabButton, activeEndTab]} onPress={changeTab('END')}>
                <Text style={[styles.tabText, activeEndText]}>종료일</Text>
                <Text style={styles.tabText}>
                  {`${endTimeFormat.meridiem} ${endTimeFormat.hour}시 ${endTimeFormat.minute}분`}
                </Text>
              </Pressable>
            </View>

            <View style={contentStyles.container}>
              <WheelPicker
                options={meridiemList}
                selectedIndex={meridiemIndex}
                visibleRest={visibleRest}
                containerStyle={contentStyles.wheelContainer}
                selectedIndicatorStyle={leftWheelWrapperStyle}
                itemTextStyle={contentStyles.wheelItemText}
                onChange={handleMeridiemChanged}
              />
              <WheelPicker
                options={hourList}
                selectedIndex={hourIndex}
                visibleRest={visibleRest}
                containerStyle={contentStyles.wheelContainer}
                selectedIndicatorStyle={contentStyles.wheelWrapper}
                itemTextStyle={contentStyles.wheelItemText}
                onChange={handleHourChanged}
              />
              <WheelPicker
                options={minuteList}
                selectedIndex={minuteIndex}
                visibleRest={visibleRest}
                containerStyle={contentStyles.wheelContainer}
                selectedIndicatorStyle={rightWheelWrapperStyle}
                itemTextStyle={contentStyles.wheelItemText}
                onChange={handleMinuteChanged}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  container: {
    width: '90%',
    maxWidth: 350,
    height: 378,
    backgroundColor: '#fff',
    borderRadius: 15
  },
  content: {
    flex: 1
  },
  tabContainer: {
    flexDirection: 'row'
  },
  tabButton: {
    flex: 1,
    gap: 7,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eeeded'
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#7c8698'
  },
  tabTimeText: {
    color: '#babfc5'
  },
  footer: {
    flexDirection: 'row',
    height: 52
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderBottomStartRadius: 15
  },
  cancelButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#777777'
  },
  confirmButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderBottomEndRadius: 15
  },
  confirmButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#fff'
  }
})

const contentStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  wheelContainer: {
    flex: 1
  },
  wheelWrapper: {
    borderRadius: 0,
    backgroundColor: '#f9f9f9'
  },
  leftWheelWrapper: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  rightWheelWrapper: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  wheelItemText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  }
})

const leftWheelWrapperStyle = StyleSheet.compose(contentStyles.wheelWrapper, contentStyles.leftWheelWrapper)
const rightWheelWrapperStyle = StyleSheet.compose(contentStyles.wheelWrapper, contentStyles.rightWheelWrapper)

TimeWheel.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: 'TimeWheelModal'
}
export default TimeWheel
