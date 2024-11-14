import React, {useRef} from 'react'
import {Platform, StyleSheet, View, Pressable, Text, Alert, Image} from 'react-native'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

import AppBar from '@/components/AppBar'
import EditTimetable from '@/components/TimeTable/src/EditTimetable'
import ControlBar from './components/ControlBar'
import EditScheduleBottomSheet from '@/components/bottomSheet/EditScheduleBottomSheet'
import OverlapScheduleListBottomSheet from '@/components/bottomSheet/OverlapScheduleListBottomSheet'
import ScheduleCategorySelectorBottomSheet from '@/components/bottomSheet/ScheduleCategorySelectorBottomSheet'
import ColorSelectorBottomSheet from '@/components/bottomSheet/ColorSelectorBottomSheet'
import ColorPickerModal from '@/components/modal/ColorPickerModal'
import CancelIcon from '@/assets/icons/cancle.svg'

import {useQueryClient} from '@tanstack/react-query'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {
  isEditState,
  isLoadingState,
  editScheduleListStatusState,
  editTimetableTranslateYState,
  activeThemeState
} from '@/store/system'
import {showOverlapScheduleListBottomSheetState} from '@/store/bottomSheet'
import {
  disableScheduleListState,
  existScheduleListState,
  scheduleDateState,
  scheduleListState,
  scheduleState,
  isInputModeState
} from '@/store/schedule'

import {EditScheduleProps} from '@/types/navigation'
import type {EditScheduleBottomSheetRef} from '@/components/bottomSheet/EditScheduleBottomSheet'
import {getTimeOfMinute} from '@/utils/helper'
import {useGetExistScheduleList, useSetSchedule} from '@/apis/hooks/useSchedule'
import RNFetchBlob from 'rn-fetch-blob'
import type {Ref as ControlBarRef} from './components/ControlBar'

const EditSchedule = ({navigation}: EditScheduleProps) => {
  const queryClient = useQueryClient()

  const getExistScheduleList = useGetExistScheduleList()
  const {mutateAsync: setScheduleMutateAsync} = useSetSchedule()

  const editScheduleBottomSheetRef = useRef<EditScheduleBottomSheetRef>(null)
  const controlBarRef = useRef<ControlBarRef>(null)

  const [isRendered, setIsRendered] = React.useState(false)
  const [isActiveControlMode, setIsActiveControlMode] = React.useState(false)

  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  // TODO 글자 중앙 정렬 sudo code
  // const [isFixedAlignCenter, setIsFixedAlignCenter] = useRecoilState(isFixedAlignCenterState)

  const activeTheme = useRecoilValue(activeThemeState)
  const editTimetableTranslateY = useRecoilValue(editTimetableTranslateYState)
  const scheduleList = useRecoilValue(scheduleListState)
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const editScheduleListStatus = useRecoilValue(editScheduleListStatusState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const setIsEdit = useSetRecoilState(isEditState)
  const setExistScheduleList = useSetRecoilState(existScheduleListState)
  const setShowOverlapScheduleListBottomSheet = useSetRecoilState(showOverlapScheduleListBottomSheetState)
  const setIsInputMode = useSetRecoilState(isInputModeState)

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
    return [timeInfoAnimatedStyle, styles.timeIntoContainer, {backgroundColor: activeTheme.color5}]
  }, [activeTheme.color5])

  const timetableStyle = React.useMemo(() => {
    return [timetableAnimatedStyle, {opacity: isLoading ? 0.6 : 1}]
  }, [isLoading])

  // TODO 글자 중앙 정렬 sudo code
  // const fixedAlignCenterColor = React.useMemo(() => {
  //   return isFixedAlignCenter ? '#ffffff' : '#696969'
  // }, [isFixedAlignCenter])

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

  const changeFontSize = React.useCallback(
    (value: number) => {
      setSchedule(prevState => ({
        ...prevState,
        font_size: value
      }))
    },
    [setSchedule]
  )

  const handleActiveControlMode = React.useCallback(() => {
    setIsActiveControlMode(true)
    setIsInputMode(false)
    editScheduleBottomSheetRef.current?.collapse()
  }, [setIsActiveControlMode, setIsInputMode])

  const closeActiveControlMode = React.useCallback(() => {
    controlBarRef.current?.close()
    setIsActiveControlMode(false)
  }, [setIsActiveControlMode])

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

  const background = React.useMemo(() => {
    if (activeTheme.theme_id === 1) {
      return <Image style={styles.backgroundImage} source={require('@/assets/white.png')} />
    }

    return (
      <Image
        style={styles.backgroundImage}
        source={{uri: `file://${RNFetchBlob.fs.dirs.DocumentDir}/${activeTheme.file_name}`}}
      />
    )
  }, [activeTheme.theme_id, activeTheme.file_name])

  return (
    <View style={styles.container}>
      <AppBar color="transparent">
        <Animated.View style={timeInfoContainerStyle}>
          <View style={styles.timeInfoWrapper}>
            <Image source={require('@/assets/icons/time.png')} style={styles.timeInfoIcon} />
            <Text style={[styles.timeInfoText, {color: activeTheme.color3}]}>{startTimeString}</Text>
            <Text style={{color: activeTheme.color3}}>-</Text>
            <Text style={[styles.timeInfoText, {color: activeTheme.color3}]}>{endTimeString}</Text>
          </View>
        </Animated.View>

        <View />

        <Pressable style={styles.appBarRightButton} onPress={closeEditScheduleBottomSheet}>
          <CancelIcon stroke={activeTheme.color7} strokeWidth={3} />
        </Pressable>
      </AppBar>

      <View style={{height: 36}} />

      <Animated.View style={timetableStyle}>
        {background}

        <EditTimetable
          data={scheduleList}
          isRendered={isRendered}
          onChangeStartTime={setNewStartTime}
          onChangeEndTime={setNewEndTime}
        />
      </Animated.View>

      {/* control mode 닫기 overlay */}
      {isActiveControlMode && <Pressable style={styles.activeControlModeOverlay} onPress={closeActiveControlMode} />}

      <View style={styles.controlBar}>
        <ControlBar
          ref={controlBarRef}
          schedule={schedule}
          displayMode={activeTheme.display_mode === 0 ? 'light' : 'dark'}
          isActiveSubmit={activeSubmit}
          changeFontSize={changeFontSize}
          onActiveControlMode={handleActiveControlMode}
          onSubmit={handleSubmit}
        />
      </View>

      <EditScheduleBottomSheet ref={editScheduleBottomSheetRef} />
      <ScheduleCategorySelectorBottomSheet />
      <OverlapScheduleListBottomSheet setScheduleMutate={handleEditSchedule} />
      <ColorSelectorBottomSheet />
      <ColorPickerModal />
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
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold'
  },

  controlBar: {
    zIndex: 999,
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16
  },
  activeControlModeOverlay: {
    zIndex: 999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

export default EditSchedule
