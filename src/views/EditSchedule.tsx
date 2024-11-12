import React, {useRef} from 'react'
import {Platform, StyleSheet, ScrollView, View, Pressable, Text, Alert, Image} from 'react-native'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import Slider from '@react-native-community/slider'
import {Shadow} from 'react-native-shadow-2'
import EditScheduleBottomSheet from '@/components/bottomSheet/EditScheduleBottomSheet'
import OverlapScheduleListBottomSheet from '@/components/bottomSheet/OverlapScheduleListBottomSheet'
import ScheduleCategorySelectorBottomSheet from '@/components/bottomSheet/ScheduleCategorySelectorBottomSheet'
import ColorSelectorBottomSheet from '@/components/bottomSheet/ColorSelectorBottomSheet'
import ColorPickerModal from '@/components/modal/ColorPickerModal'
import AppBar from '@/components/AppBar'
import EditTimetable from '@/components/TimeTable/src/EditTimetable'

import CancelIcon from '@/assets/icons/cancle.svg'
import AlignCenterIcon from '@/assets/icons/align_center.svg'

import {useQueryClient} from '@tanstack/react-query'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {
  isEditState,
  isLoadingState,
  editScheduleListStatusState,
  editTimetableTranslateYState,
  activeThemeState
} from '@/store/system'
import {showColorSelectorBottomSheetState, showOverlapScheduleListBottomSheetState} from '@/store/bottomSheet'
import {
  disableScheduleListState,
  existScheduleListState,
  isFixedAlignCenterState,
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

type ControlMode = 'fontSize' | 'rotate' | null
const EditSchedule = ({navigation}: EditScheduleProps) => {
  const queryClient = useQueryClient()

  const getExistScheduleList = useGetExistScheduleList()
  const {mutateAsync: setScheduleMutateAsync} = useSetSchedule()

  const editScheduleBottomSheetRef = useRef<EditScheduleBottomSheetRef>(null)

  const [isRendered, setIsRendered] = React.useState(false)
  const [activeControlMode, setActiveControlMode] = React.useState<ControlMode>(null)

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
  const setShowColorSelectorBottomSheet = useSetRecoilState(showColorSelectorBottomSheetState)
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

  const fontSizeButtonTextStyle = React.useMemo(() => {
    return activeControlMode === 'fontSize' ? activeFontSizeButtonTextStyle : styles.fontSizeButtonText
  }, [activeControlMode])

  // TODO 글자 중앙 정렬 sudo code
  // const fixedAlignCenterColor = React.useMemo(() => {
  //   return isFixedAlignCenter ? '#ffffff' : '#696969'
  // }, [isFixedAlignCenter])

  const getControlButtonTextStyle = (bool: boolean) => {
    return bool ? activeControlButtonTextStyle : styles.controlButtonText
  }

  const submitButtonStyle = React.useMemo(() => {
    return activeSubmit ? activeSubmitButtonStyle : styles.submitButton
  }, [activeSubmit])

  const submitButtonTextStyle = React.useMemo(() => {
    return activeSubmit ? activeSubmitButtonTextStyle : styles.submitButtonText
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

  const showColorSelectorBottomSheet = React.useCallback(() => {
    setIsInputMode(false)
    setShowColorSelectorBottomSheet(true)
    editScheduleBottomSheetRef.current?.collapse()
  }, [setShowColorSelectorBottomSheet])

  const changeActiveControlMode = React.useCallback(
    (mode: ControlMode) => () => {
      if (activeControlMode && activeControlMode === mode) {
        setActiveControlMode(null)
      } else {
        setIsInputMode(false)
        editScheduleBottomSheetRef.current?.collapse()
        setActiveControlMode(mode)
      }
    },
    [activeControlMode, setActiveControlMode]
  )

  const changeFontSize = React.useCallback(
    (value: number) => {
      setSchedule(prevState => ({
        ...prevState,
        font_size: value
      }))
    },
    [setSchedule]
  )

  // TODO 글자 중앙 정렬 sudo code
  // const handleFixedAlignCenter = React.useCallback(() => {
  //   setIsFixedAlignCenter(!isFixedAlignCenter)
  // }, [isFixedAlignCenter, setIsFixedAlignCenter])

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
      {activeControlMode && (
        <Pressable style={styles.activeControlModeOverlay} onPress={() => setActiveControlMode(null)} />
      )}

      {activeControlMode === 'fontSize' && (
        <Shadow
          containerStyle={styles.controlViewShadowContainer}
          stretch={true}
          startColor={activeTheme.color5}
          distance={15}>
          <View style={[styles.controlViewContainer, {backgroundColor: activeTheme.color1}]}>
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
      )}

      <Shadow
        containerStyle={styles.controlButtonShadowContainer}
        stretch={true}
        startColor={activeTheme.color5}
        distance={30}
        offset={[0, 20]}>
        <View style={[styles.controlButtonContainer, {backgroundColor: activeTheme.color1}]}>
          <Pressable style={styles.colorButton} onPress={showColorSelectorBottomSheet}>
            <Image source={require('@/assets/icons/color.png')} style={styles.colorIcon} />
          </Pressable>

          <ScrollView contentContainerStyle={styles.controlButtonScrollContainer} horizontal={true}>
            <Pressable style={styles.controlButton} onPress={changeActiveControlMode('fontSize')}>
              <View style={styles.controlButtonWrapper}>
                <Text style={fontSizeButtonTextStyle}>{schedule.font_size}</Text>
              </View>

              <Text style={getControlButtonTextStyle(activeControlMode === 'fontSize')}>글자 크기</Text>
            </Pressable>

            {/* TODO - 테마 작업 후 추가 예정*/}
            {/*<Pressable style={styles.controlButton} onPress={handleFixedAlignCenter}>*/}
            {/*  <View style={styles.controlButtonWrapper}>*/}
            {/*    <AlignCenterIcon width={24} height={24} stroke={fixedAlignCenterColor} />*/}
            {/*  </View>*/}

            {/*  <Text style={getControlButtonTextStyle(isFixedAlignCenter)}>중앙 맞춤</Text>*/}
            {/*</Pressable>*/}

            {/* TODO - 폰트 작업 후 추가 예정 */}
            {/*<Pressable style={styles.controlButton}>*/}
            {/*  <View style={styles.controlButtonWrapper}>*/}
            {/*    <Text style={styles.fontSizeButtonText}>A</Text>*/}
            {/*  </View>*/}

            {/*  <Text style={styles.controlButtonText}>폰트</Text>*/}
            {/*</Pressable>*/}
          </ScrollView>

          <Pressable style={submitButtonStyle} disabled={!activeSubmit} onPress={handleSubmit}>
            <Text style={submitButtonTextStyle}>{schedule.schedule_id ? '수정' : '등록'}</Text>
          </Pressable>
        </View>
      </Shadow>

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

  activeControlModeOverlay: {
    zIndex: 99,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  controlViewShadowContainer: {
    zIndex: 999,
    position: 'absolute',
    bottom: 82,
    left: 16,
    right: 16
  },
  controlViewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10
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
  controlButtonShadowContainer: {
    zIndex: 999,
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16
  },
  controlButtonContainer: {
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
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 10,
    color: '#696969'
  },
  colorButton: {
    paddingRight: 15
  },
  colorIcon: {
    width: 40,
    height: 40,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#696969'
  },
  fontSizeButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 26,
    color: '#696969'
  },

  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    borderRadius: 24,
    paddingHorizontal: 20,
    backgroundColor: '#f5f6f8',
    marginLeft: 15
  },
  submitButtonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#babfc5'
  }
})

const activeControlButtonTextStyle = StyleSheet.compose(styles.controlButtonText, {color: '#ffffff'})
const activeFontSizeButtonTextStyle = StyleSheet.compose(styles.fontSizeButtonText, {color: '#ffffff'})

const activeSubmitButtonStyle = StyleSheet.compose(styles.submitButton, {backgroundColor: '#1E90FF'})
const activeSubmitButtonTextStyle = StyleSheet.compose(styles.submitButtonText, {color: '#ffffff'})

export default EditSchedule
