import React from 'react'
import {Platform, StyleSheet, ScrollView, View, Pressable, Text, Alert, Image} from 'react-native'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import Slider from '@react-native-community/slider'
import {Shadow} from 'react-native-shadow-2'
import EditScheduleBottomSheet from '@/components/bottomSheet/EditScheduleBottomSheet'
import OverlapScheduleListBottomSheet from '@/components/bottomSheet/OverlapScheduleListBottomSheet'
import ScheduleCategorySelectorBottomSheet from '@/components/bottomSheet/ScheduleCategorySelectorBottomSheet'
import AppBar from '@/components/AppBar'
import EditTimetable from '@/components/TimeTable/src/EditTimetable'

import CancelIcon from '@/assets/icons/cancle.svg'
import RotateIcon from '@/assets/icons/rotate.svg'

import {useQueryClient} from '@tanstack/react-query'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {
  isEditState,
  isLoadingState,
  editScheduleListStatusState,
  bottomSafeAreaColorState,
  editTimetableTranslateYState
} from '@/store/system'
import {showOverlapScheduleListBottomSheetState} from '@/store/bottomSheet'
import {
  disableScheduleListState,
  existScheduleListState,
  scheduleDateState,
  scheduleListState,
  scheduleState
} from '@/store/schedule'

import {EditScheduleProps} from '@/types/navigation'
import {getTimeOfMinute} from '@/utils/helper'
import {useGetExistScheduleList, useSetSchedule} from '@/apis/hooks/useSchedule'

const EditSchedule = ({navigation}: EditScheduleProps) => {
  const queryClient = useQueryClient()

  const getExistScheduleList = useGetExistScheduleList()
  const {mutateAsync: setScheduleMutateAsync} = useSetSchedule()

  const [isRendered, setIsRendered] = React.useState(false)

  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const editTimetableTranslateY = useRecoilValue(editTimetableTranslateYState)
  const scheduleList = useRecoilValue(scheduleListState)
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const editScheduleListStatus = useRecoilValue(editScheduleListStatusState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const setIsEdit = useSetRecoilState(isEditState)
  const setExistScheduleList = useSetRecoilState(existScheduleListState)
  const setShowOverlapScheduleListBottomSheet = useSetRecoilState(showOverlapScheduleListBottomSheetState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)

  const [newStartTime, setNewStartTime] = React.useState(schedule.start_time)
  const [newEndTime, setNewEndTime] = React.useState(schedule.end_time)

  const timeTableTranslateY = useSharedValue(0)
  const timeInfoTranslateX = useSharedValue(-250)

  const activeSubmit = React.useMemo(() => {
    const dayOfWeekList = [
      schedule.mon,
      schedule.tue,
      schedule.wed,
      schedule.thu,
      schedule.fri,
      schedule.sat,
      schedule.sun
    ]

    return !!(schedule.title && dayOfWeekList.some(item => item === '1'))
  }, [schedule.title, schedule.mon, schedule.tue, schedule.wed, schedule.thu, schedule.fri, schedule.sat, schedule.sun])

  const timeInfoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: timeInfoTranslateX.value}]
    }
  })
  const timetableAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: timeTableTranslateY.value}]
  }))

  const timeInfoContainerStyle = React.useMemo(() => {
    return [timeInfoAnimatedStyle, styles.timeIntoContainer]
  }, [])

  const timetableStyle = React.useMemo(() => {
    return [timetableAnimatedStyle, {opacity: isLoading ? 0.6 : 1}]
  }, [isLoading])

  const submitButtonStyle = React.useMemo(() => {
    return [styles.submitButton, activeSubmit && styles.activeSubmitBtn]
  }, [activeSubmit])

  const submitTextStyle = React.useMemo(() => {
    return [styles.submitText, activeSubmit && styles.activeSubmitText]
  }, [activeSubmit])

  const startTimeString = React.useMemo(() => {
    const timeOfMinute = getTimeOfMinute(newStartTime)

    return `${timeOfMinute.meridiem} ${timeOfMinute.hour}시 ${timeOfMinute.minute}분`
  }, [newStartTime])

  const endTimeString = React.useMemo(() => {
    const timeOfMinute = getTimeOfMinute(newEndTime)

    return `${timeOfMinute.meridiem} ${timeOfMinute.hour}시 ${timeOfMinute.minute}분`
  }, [newEndTime])

  const closeEditScheduleBottomSheet = React.useCallback(() => {
    Alert.alert('나가기', '작성한 내용은 저장되지 않아요.', [
      {
        text: '취소'
      },
      {
        text: '나가기',
        onPress: () => {
          setIsEdit(false)
          navigation.goBack()
        }
      }
    ])
  }, [setIsEdit, navigation])

  const invalidScheduleList = React.useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['scheduleList', scheduleDate]})
  }, [queryClient, scheduleDate])

  const handleEditSchedule = React.useCallback(async () => {
    try {
      await setScheduleMutateAsync(schedule)

      invalidScheduleList()

      navigation.navigate('MainTabs', {
        screen: 'Home',
        params: {scheduleUpdated: true}
      })

      setIsEdit(false)
    } catch (e) {
      console.error('error', e)
    }
  }, [schedule, invalidScheduleList, navigation, setScheduleMutateAsync, setIsEdit])

  const handleSubmit = React.useCallback(async () => {
    try {
      const existScheduleList = await getExistScheduleList.mutateAsync()
      setExistScheduleList(existScheduleList)

      if (existScheduleList.length > 0 || disableScheduleList.length > 0) {
        setShowOverlapScheduleListBottomSheet(true)
        return
      }
    } catch (e) {
      console.error('erer', e)
    }

    await handleEditSchedule()
  }, [
    handleEditSchedule,
    setExistScheduleList,
    setShowOverlapScheduleListBottomSheet,
    getExistScheduleList,
    disableScheduleList.length
  ])

  // React.useEffect(() => {
  //   if (activeSubmit) {
  //     setBottomSafeAreaColor('#1E90FF')
  //   } else {
  //     setBottomSafeAreaColor('#f5f6f8')
  //   }
  // }, [activeSubmit, setBottomSafeAreaColor])

  React.useEffect(() => {
    if (editScheduleListStatus === 0) {
      timeInfoTranslateX.value = withTiming(-10)
    } else {
      timeInfoTranslateX.value = withTiming(-250)
    }
  }, [editScheduleListStatus])

  React.useEffect(() => {
    timeTableTranslateY.value = withTiming(-editTimetableTranslateY, {duration: 300}, () => {
      runOnJS(setIsRendered)(true)
    })

    return () => {
      timeTableTranslateY.value = 0
      setIsRendered(false)
    }
  }, [editTimetableTranslateY, setIsRendered])

  // const [fontSize, setFontSize] = React.useState(12)

  const changeFontSize = React.useCallback(
    (value: number) => {
      setSchedule(prevState => ({
        ...prevState,
        font_size: value
      }))
    },
    [setSchedule]
  )

  return (
    <View style={styles.container}>
      <AppBar>
        <Animated.View style={timeInfoContainerStyle}>
          <View style={styles.timeInfoWrapper}>
            <Image source={require('@/assets/icons/time.png')} style={styles.timeInfoIcon} />
            <Text style={styles.timeInfoText}>{startTimeString}</Text>
            <Text style={{color: '#8d9195'}}>-</Text>
            <Text style={styles.timeInfoText}>{endTimeString}</Text>
          </View>
        </Animated.View>

        <View />

        <Pressable style={styles.appBarRightButton} onPress={closeEditScheduleBottomSheet}>
          <CancelIcon stroke="#242933" />
        </Pressable>
      </AppBar>

      <View style={{height: 36}} />

      <Animated.View style={timetableStyle}>
        <EditTimetable
          data={scheduleList}
          isRendered={isRendered}
          onChangeStartTime={setNewStartTime}
          onChangeEndTime={setNewEndTime}
        />
      </Animated.View>

      {/*<Pressable style={submitButtonStyle} onPress={handleSubmit} disabled={!activeSubmit}>*/}
      {/*  <Text style={submitTextStyle}>{schedule.schedule_id ? '수정하기' : '등록하기'}</Text>*/}
      {/*</Pressable>*/}

      <Shadow
        containerStyle={{zIndex: 999, position: 'absolute', bottom: 72, left: 16, right: 16}}
        stretch={true}
        startColor={'#ffffff'}
        distance={15}>
        <View style={styles.controlViewContainer}>
          <View style={styles.controlViewWrapper}>
            <Slider
              style={{flex: 1}}
              value={schedule.font_size}
              step={2}
              minimumValue={10}
              maximumValue={32}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={changeFontSize}
            />

            <Text style={styles.controlText}>{schedule.font_size}</Text>
          </View>
        </View>
      </Shadow>

      <View style={styles.controlButtonContainer}>
        <Pressable style={styles.colorButton}>
          <Image source={require('@/assets/icons/color.png')} style={styles.colorIcon} />
        </Pressable>

        <ScrollView contentContainerStyle={styles.controlButtonScrollContainer} horizontal={true}>
          {/* 글자 크기 | 글자 회전 */}

          <Pressable style={styles.controlButton}>
            <View style={styles.controlButtonWrapper}>
              <Text style={styles.fontSizeButtonText}>{schedule.font_size}</Text>
            </View>
            <Text style={styles.controlButtonText}>글자 크기</Text>
          </Pressable>

          <Pressable style={styles.controlButton}>
            <View style={styles.controlButtonWrapper}>
              <RotateIcon width={28} height={28} stroke="#ffffff" strokeWidth={38} />
            </View>

            <Text style={styles.controlButtonText}>글자 회전</Text>
          </Pressable>

          <Pressable style={styles.controlButton}>
            <View style={styles.controlButtonWrapper}>
              <Text style={styles.fontSizeButtonText}>A</Text>
            </View>

            <Text style={styles.controlButtonText}>폰트</Text>
          </Pressable>
        </ScrollView>

        <Pressable style={styles.submitButton2}>
          <Text style={styles.submitButtonText}>등록</Text>
        </Pressable>
      </View>

      <EditScheduleBottomSheet />
      <ScheduleCategorySelectorBottomSheet />
      <OverlapScheduleListBottomSheet setScheduleMutate={handleEditSchedule} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  appBarRightButton: {
    width: 36,
    height: 36,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  timeIntoContainer: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,

    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: '#00000010',

        shadowColor: '#00000010',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1
      },
      android: {
        elevation: 2
      }
    })
  },
  timeInfoWrapper: {
    paddingLeft: 10,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeInfoIcon: {
    width: 16,
    height: 16
  },
  timeInfoText: {
    color: '#8d9195',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold'
  },

  controlViewContainer: {
    zIndex: 999,

    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#424242'
  },
  controlViewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  controlText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#ffffff'
  },
  controlButtonContainer: {
    zIndex: 999,
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#424242'
  },
  controlButtonScrollContainer: {
    gap: 5
  },
  controlButtonWrapper: {
    height: 29,
    justifyContent: 'center',
    transform: [{translateY: -1}]
  },
  controlButton: {
    width: 52,
    height: 42,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  controlButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 10,
    color: '#ffffff'
  },
  colorButton: {
    paddingRight: 10
  },
  colorIcon: {
    width: 40,
    height: 40,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  fontSizeButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 26,
    color: '#ffffff'
  },
  submitButton2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    borderRadius: 24,
    paddingHorizontal: 20,
    backgroundColor: '#1E90FF',
    marginLeft: 10
  },
  submitButtonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#ffffff'
  },

  // bottom button style
  submitButton: {
    height: 56,
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8'
  },
  submitText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#babfc5'
  },
  activeSubmitBtn: {
    backgroundColor: '#1E90FF'
  },
  activeSubmitText: {
    color: '#fff'
  }
})

export default EditSchedule
