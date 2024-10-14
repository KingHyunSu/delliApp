import React from 'react'
import {StyleSheet, Pressable, View, Text, Alert, Image} from 'react-native'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import EditScheduleBottomSheet from '@/components/bottomSheet/EditScheduleBottomSheet'
import OverlapScheduleListBottomSheet from '@/components/bottomSheet/OverlapScheduleListBottomSheet'
import ScheduleCategorySelectorBottomSheet from '@/components/bottomSheet/ScheduleCategorySelectorBottomSheet'
import AppBar from '@/components/AppBar'
import EditTimetable from '@/components/TimeTable/src/EditTimetable'

import CancelIcon from '@/assets/icons/cancle.svg'
import {useQueryClient} from '@tanstack/react-query'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {isEditState, isLoadingState, editScheduleListStatusState, bottomSafeAreaColorState} from '@/store/system'
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

  const schedule = useRecoilValue(scheduleState)
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

  React.useEffect(() => {
    if (activeSubmit) {
      setBottomSafeAreaColor('#1E90FF')
    } else {
      setBottomSafeAreaColor('#f5f6f8')
    }
  }, [activeSubmit, setBottomSafeAreaColor])

  React.useEffect(() => {
    if (editScheduleListStatus === 0) {
      timeInfoTranslateX.value = withTiming(-10)
    } else {
      timeInfoTranslateX.value = withTiming(-250)
    }
  }, [editScheduleListStatus])

  React.useEffect(() => {
    const dateBarHeight = 36

    timeTableTranslateY.value = withTiming(-dateBarHeight, {duration: 300}, () => {
      runOnJS(setIsRendered)(true)
    })

    return () => {
      timeTableTranslateY.value = 0
      setIsRendered(false)
    }
  }, [setIsRendered])

  return (
    <View style={styles.container}>
      <AppBar>
        <Animated.View style={timeInfoContainerStyle}>
          <View style={styles.timeInfoWrapper}>
            <Image source={require('@/assets/icons/time.png')} style={styles.timeInfoIcon} />
            <Text style={styles.timeInfoText}>{startTimeString}</Text>
            <Text>-</Text>
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

      <Pressable style={submitButtonStyle} onPress={handleSubmit} disabled={!activeSubmit}>
        <Text style={submitTextStyle}>{schedule.schedule_id ? '수정하기' : '등록하기'}</Text>
      </Pressable>

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
    width: 245,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00000010',
    borderRadius: 10,

    shadowColor: '#00000010',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1
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
    color: '#424242',
    fontSize: 14,
    fontFamily: 'Pretendard-Medium'
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
