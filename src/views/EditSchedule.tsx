import React from 'react'
import {StyleSheet, Pressable, View, Text, Alert, Platform, Image} from 'react-native'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import EditScheduleBottomSheet from '@/views/BottomSheet/EditScheduleBottomSheet'
import AppBar from '@/components/AppBar'
import EditTimetable from '@/components/TimeTable/src/EditTimetable'
import {useQueryClient, useMutation} from '@tanstack/react-query'

import CancleIcon from '@/assets/icons/cancle.svg'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {isEditState, isLoadingState, editScheduleListStatusState} from '@/store/system'
import {showEditScheduleCheckBottomSheetState} from '@/store/bottomSheet'
import {
  disableScheduleListState,
  existScheduleListState,
  scheduleDateState,
  scheduleListState,
  scheduleState
} from '@/store/schedule'

import {EditScheduleProps} from '@/types/navigation'
import {scheduleRepository} from '@/repository'
import {getTimeOfMinute} from '@/utils/helper'
import ScheduleCategoryBottomSheet from '@/views/BottomSheet/ScheduleCategoryBottomSheet'
import EditScheduleCheckBottomSheet from '@/views/BottomSheet/EditScheduleCheckBottomSheet'

const EditSchedule = ({navigation}: EditScheduleProps) => {
  const queryClient = useQueryClient()

  const [isRendered, setIsRendered] = React.useState(false)

  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)

  const schedule = useRecoilValue(scheduleState)
  const scheduleList = useRecoilValue(scheduleListState)
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const editScheduleListStatus = useRecoilValue(editScheduleListStatusState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const setIsEdit = useSetRecoilState(isEditState)
  const setExistScheduleList = useSetRecoilState(existScheduleListState)
  const setShowEditScheduleCheckBottomSheet = useSetRecoilState(showEditScheduleCheckBottomSheetState)

  const [newStartTime, setNewStartTime] = React.useState(schedule.start_time)
  const [newEndTime, setNewEndTime] = React.useState(schedule.end_time)

  const timeTableTranslateY = useSharedValue(0)
  const timeInfoTranslateX = useSharedValue(-250)

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

  const submitButtonStyle = React.useMemo(() => {
    return [styles.submitButton, activeSubmit && styles.activeSubmitBtn, {height: 52}]
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
  }, [setIsEdit])

  const invalidScheduleList = React.useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['scheduleList', scheduleDate]})
  }, [queryClient, scheduleDate])

  const {mutateAsync: getExistScheduleListMutateAsync} = useMutation({
    mutationFn: async () => {
      const params = {
        schedule_id: schedule.schedule_id,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        mon: schedule.mon,
        tue: schedule.tue,
        wed: schedule.wed,
        thu: schedule.thu,
        fri: schedule.fri,
        sat: schedule.sat,
        sun: schedule.sun,
        start_date: schedule.start_date,
        end_date: schedule.end_date
      }

      return await scheduleRepository.getExistScheduleList(params)
    }
  })

  const {mutate: setScheduleMutate} = useMutation({
    mutationFn: async () => {
      const params = {schedule}

      if (params.schedule.schedule_id) {
        return await scheduleRepository.updateSchedule(params)
      } else {
        return await scheduleRepository.setSchedule(params)
      }
    },
    onSuccess: () => {
      invalidScheduleList()

      navigation.navigate('MainTabs', {
        screen: 'Home',
        params: {scheduleUpdated: true}
      })

      setIsEdit(false)
    },
    onError: e => {
      console.error('error', e)
    }
  })

  const handleSubmit = React.useCallback(async () => {
    try {
      const existScheduleList = await getExistScheduleListMutateAsync()
      setExistScheduleList(existScheduleList)

      if (existScheduleList.length > 0 || disableScheduleList.length > 0) {
        setShowEditScheduleCheckBottomSheet(true)
        return
      }
    } catch (e) {
      console.error('erer', e)
    }

    setScheduleMutate()
  }, [
    setScheduleMutate,
    getExistScheduleListMutateAsync,
    setExistScheduleList,
    setShowEditScheduleCheckBottomSheet,
    disableScheduleList.length
  ])

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
          <CancleIcon stroke="#242933" />
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
      <ScheduleCategoryBottomSheet />
      <EditScheduleCheckBottomSheet invalidScheduleList={invalidScheduleList} />
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
