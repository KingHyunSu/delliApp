import React, {useRef, useState} from 'react'
import {StyleSheet, View, Pressable, Alert, Image} from 'react-native'
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

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {
  isEditState,
  isLoadingState,
  editScheduleListStatusState,
  editTimetableTranslateYState,
  displayModeState,
  activeBackgroundState,
  activeColorThemeDetailState
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

import {useQueryClient} from '@tanstack/react-query'
import {useEditColorTheme, useGetExistScheduleList, useSetSchedule} from '@/apis/hooks/useSchedule'
import {colorKit} from 'reanimated-color-picker'
import {EditScheduleProps} from '@/types/navigation'
import type {EditScheduleBottomSheetRef} from '@/components/bottomSheet/EditScheduleBottomSheet'
import type {Ref as ControlBarRef} from './components/ControlBar'
import {EditColorThemeRequest} from '@/apis/types/schedule'

const EditSchedule = ({navigation}: EditScheduleProps) => {
  const queryClient = useQueryClient()

  const getExistScheduleList = useGetExistScheduleList()
  const {mutateAsync: setScheduleMutateAsync} = useSetSchedule()
  const {mutateAsync: editColorThemeMutateAsync} = useEditColorTheme()

  const editScheduleBottomSheetRef = useRef<EditScheduleBottomSheetRef>(null)
  const controlBarRef = useRef<ControlBarRef>(null)

  const [isRendered, setIsRendered] = React.useState(false)
  const [isActiveControlMode, setIsActiveControlMode] = React.useState(false)

  const [activeColorThemeDetail, setActiveColorThemeDetail] = useRecoilState(activeColorThemeDetailState)

  const [editColorThemeDetail, setEditColorThemeDetail] = useState<EditColorThemeDetail>({
    colorThemeType: activeColorThemeDetail.color_theme_type,
    colorThemeItemList: activeColorThemeDetail.color_theme_item_list.map(item => ({
      id: item.color_theme_item_id,
      color: item.color,
      order: item.order,
      actionType: null
    }))
  })

  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  // TODO 글자 중앙 정렬 sudo code
  // const [isFixedAlignCenter, setIsFixedAlignCenter] = useRecoilState(isFixedAlignCenterState)

  const displayMode = useRecoilValue(displayModeState)
  const activeBackground = useRecoilValue(activeBackgroundState)
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

  const timetableAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: timeTableTranslateY.value}]
  }))

  const timetableStyle = React.useMemo(() => {
    return [timetableAnimatedStyle, {opacity: isLoading ? 0.6 : 1}]
  }, [isLoading])

  // TODO 글자 중앙 정렬 sudo code
  // const fixedAlignCenterColor = React.useMemo(() => {
  //   return isFixedAlignCenter ? '#ffffff' : '#696969'
  // }, [isFixedAlignCenter])

  const colorThemeDetail = React.useMemo<ColorThemeDetail>(() => {
    let colorThemeItemList: ColorThemeItem[] = []

    switch (editColorThemeDetail.colorThemeType) {
      case 1:
        colorThemeItemList = [
          {color_theme_item_id: -1, color: activeBackground.background_color, order: 1},
          {color_theme_item_id: -1, color: colorKit.brighten(activeBackground.background_color, 20).hex(), order: 2}
        ]
        break
      case 2:
        colorThemeItemList = editColorThemeDetail.colorThemeItemList
          .filter(item => item.actionType !== 'D')
          .map(item => ({
            color_theme_item_id: item.id,
            color: item.color,
            order: item.order
          }))

        break
      default:
        break
    }

    return {
      color_theme_type: editColorThemeDetail.colorThemeType,
      color_theme_item_list: colorThemeItemList
    }
  }, [editColorThemeDetail, activeBackground.background_color])

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

  const doSubmit = React.useCallback(async () => {
    if (activeColorThemeDetail.color_theme_type !== editColorThemeDetail.colorThemeType) {
      const editColorThemeParams: EditColorThemeRequest = {
        color_theme_type: editColorThemeDetail.colorThemeType,
        insert_color_theme_item_list: [],
        update_color_theme_item_list: [],
        delete_color_theme_item_list: []
      }

      editColorThemeDetail.colorThemeItemList.forEach(item => {
        const param: ColorThemeItem = {color_theme_item_id: item.id, color: item.color, order: item.order}

        if (item.actionType === 'I') {
          editColorThemeParams.insert_color_theme_item_list.push(param)
        } else if (item.actionType === 'U') {
          editColorThemeParams.update_color_theme_item_list.push(param)
        } else if (item.actionType === 'D') {
          editColorThemeParams.delete_color_theme_item_list.push(param)
        }
      })

      const response = await editColorThemeMutateAsync(editColorThemeParams)

      if (response.result) {
        setActiveColorThemeDetail(colorThemeDetail)
      }
    }

    await setScheduleMutateAsync(schedule)

    invalidScheduleList()

    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {scheduleUpdated: true}
    })

    setIsEdit(false)
  }, [
    colorThemeDetail,
    activeColorThemeDetail.color_theme_type,
    editColorThemeDetail,
    schedule,
    invalidScheduleList,
    editColorThemeMutateAsync,
    setScheduleMutateAsync,
    navigation,
    setActiveColorThemeDetail,
    setIsEdit
  ])

  const handleSubmit = React.useCallback(async () => {
    try {
      const existScheduleList = await getExistScheduleList.mutateAsync()
      setExistScheduleList(existScheduleList)

      if (existScheduleList.length > 0 || disableScheduleList.length > 0) {
        setShowOverlapScheduleListBottomSheet(true)
        return
      }

      await doSubmit()
    } catch (e) {
      console.error('error', e)
    }
  }, [
    getExistScheduleList,
    disableScheduleList.length,
    doSubmit,
    setExistScheduleList,
    setShowOverlapScheduleListBottomSheet
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
    if (!activeBackground || activeBackground.background_id === 1) {
      return <Image style={styles.backgroundImage} source={require('@/assets/beige.png')} />
    }

    return <Image style={styles.backgroundImage} source={{uri: activeBackground.main_url}} />
  }, [activeBackground])

  return (
    <View style={[styles.container, {backgroundColor: activeBackground.background_color}]}>
      <AppBar color="transparent">
        <Pressable style={styles.appBarRightButton} onPress={closeEditScheduleBottomSheet}>
          <CancelIcon stroke={activeBackground.accent_color} strokeWidth={3} />
        </Pressable>
      </AppBar>

      <View style={{height: 36}} />

      <Animated.View style={timetableStyle}>
        {background}

        <EditTimetable
          data={scheduleList}
          colorThemeDetail={colorThemeDetail}
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
          displayMode={displayMode === 1 ? 'light' : 'dark'}
          isActiveSubmit={activeSubmit}
          changeFontSize={changeFontSize}
          onActiveControlMode={handleActiveControlMode}
          onSubmit={handleSubmit}
        />
      </View>

      <EditScheduleBottomSheet ref={editScheduleBottomSheetRef} startTime={newStartTime} endTime={newEndTime} />
      <ScheduleCategorySelectorBottomSheet />
      <OverlapScheduleListBottomSheet onSubmit={doSubmit} />
      <ColorSelectorBottomSheet
        colorThemeDetail={colorThemeDetail}
        editColorThemeDetail={editColorThemeDetail}
        onChangeEditColorThemeDetail={setEditColorThemeDetail}
      />
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
