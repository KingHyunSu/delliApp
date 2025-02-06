import React, {useRef, useState} from 'react'
import {StyleSheet, BackHandler, View, Pressable, Alert, Image} from 'react-native'
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import {useFocusEffect} from '@react-navigation/native'

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
  activeColorThemeDetailState,
  activeThemeState
} from '@/store/system'
import {
  scheduleDateState,
  scheduleListState,
  isInputModeState,
  editScheduleFormState,
  editScheduleTimeState,
  editSchedulePositionState
} from '@/store/schedule'

import {useQueryClient} from '@tanstack/react-query'
import {useGetOverlapScheduleList, useSetSchedule, useUpdateSchedule} from '@/apis/hooks/useSchedule'
import {useUpdateColorTheme} from '@/apis/hooks/useUser'
import {EditScheduleProps} from '@/types/navigation'
import type {EditScheduleBottomSheetRef} from '@/components/bottomSheet/EditScheduleBottomSheet'
import type {Ref as ControlBarRef} from './components/ControlBar'
import {GetOverlapScheduleListResponse} from '@/apis/types/schedule'
import {UpdateColorThemeRequest} from '@/apis/types/user'
import {format} from 'date-fns'
import {showColorSelectorBottomSheetState} from '@/store/bottomSheet'
import {reloadWidgetWithImageState} from '@/store/widget'

const EditSchedule = ({navigation}: EditScheduleProps) => {
  const queryClient = useQueryClient()

  const {mutateAsync: getOverlapScheduleListMutateAsync} = useGetOverlapScheduleList()
  const {mutateAsync: setScheduleMutateAsync} = useSetSchedule()
  const {mutateAsync: updateScheduleMutateAsync} = useUpdateSchedule()
  const {mutateAsync: updateColorThemeMutateAsync} = useUpdateColorTheme()

  const editScheduleBottomSheetRef = useRef<EditScheduleBottomSheetRef>(null)
  const controlBarRef = useRef<ControlBarRef>(null)

  const [isActiveControlMode, setIsActiveControlMode] = React.useState(false)
  const [overlapScheduleList, setOverlapScheduleList] = React.useState<GetOverlapScheduleListResponse[]>([])
  const [showOverlapScheduleListBottomSheet, setShowOverlapScheduleListBottomSheet] = React.useState(false)

  const [showColorSelectorBottomSheet, setShowColorSelectorBottomSheet] = useRecoilState(
    showColorSelectorBottomSheetState
  )
  const [activeColorThemeDetail, setActiveColorThemeDetail] = useRecoilState(activeColorThemeDetailState)
  const [editColorThemeDetail, setEditColorThemeDetail] = useState<EditColorThemeDetail>({
    isActiveColorTheme: activeColorThemeDetail.is_active_color_theme,
    colorThemeItemList: activeColorThemeDetail.color_theme_item_list.map(item => ({
      color_theme_item_id: item.color_theme_item_id,
      background_color: item.background_color,
      text_color: item.text_color,
      order: item.order,
      actionType: item.color_theme_item_id === -1 ? 'I' : null
    }))
  })

  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [editScheduleForm, setEditScheduleForm] = useRecoilState(editScheduleFormState)

  const displayMode = useRecoilValue(displayModeState)
  const activeTheme = useRecoilValue(activeThemeState)
  const activeBackground = useRecoilValue(activeBackgroundState)
  const editTimetableTranslateY = useRecoilValue(editTimetableTranslateYState)
  const scheduleList = useRecoilValue(scheduleListState)
  const editScheduleListStatus = useRecoilValue(editScheduleListStatusState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const editSchedulePosition = useRecoilValue(editSchedulePositionState)

  const setIsEdit = useSetRecoilState(isEditState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setEditScheduleTime = useSetRecoilState(editScheduleTimeState)
  const setReloadWidgetWithImage = useSetRecoilState(reloadWidgetWithImageState)

  const timeTableTranslateY = useSharedValue(0)
  const timeInfoTranslateX = useSharedValue(-250)

  const activeSubmit = React.useMemo(() => {
    const dayOfWeekList = [
      editScheduleForm.mon,
      editScheduleForm.tue,
      editScheduleForm.wed,
      editScheduleForm.thu,
      editScheduleForm.fri,
      editScheduleForm.sat,
      editScheduleForm.sun
    ]

    return !!(editScheduleForm.title && dayOfWeekList.some(item => item === '1'))
  }, [
    editScheduleForm.title,
    editScheduleForm.mon,
    editScheduleForm.tue,
    editScheduleForm.wed,
    editScheduleForm.thu,
    editScheduleForm.fri,
    editScheduleForm.sat,
    editScheduleForm.sun
  ])

  const timetableAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: timeTableTranslateY.value}]
  }))

  const timetableStyle = React.useMemo(() => {
    return [timetableAnimatedStyle, {opacity: isLoading ? 0.6 : 1}]
  }, [isLoading])

  const colorThemeDetail = React.useMemo<ColorThemeDetail>(() => {
    let colorThemeItemList: ColorThemeItem[] = []

    if (editColorThemeDetail.isActiveColorTheme) {
      colorThemeItemList = editColorThemeDetail.colorThemeItemList
        .filter(item => item.actionType !== 'D')
        .map(item => ({
          color_theme_item_id: item.color_theme_item_id,
          background_color: item.background_color,
          text_color: item.text_color,
          order: item.order
        }))
    }

    return {
      is_active_color_theme: editColorThemeDetail.isActiveColorTheme,
      color_theme_item_list: colorThemeItemList
    }
  }, [editColorThemeDetail])

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

  const handleActiveControlMode = React.useCallback(() => {
    setIsActiveControlMode(true)
    setIsInputMode(false)
    editScheduleBottomSheetRef.current?.collapse()
  }, [setIsActiveControlMode, setIsInputMode])

  const closeActiveControlMode = React.useCallback(() => {
    controlBarRef.current?.close()
    setIsActiveControlMode(false)
  }, [setIsActiveControlMode])

  type NewScheduleItem = Omit<EditScheduleForm, 'schedule_id'> & {schedule_id: number}
  const getNewScheduleList = React.useCallback(
    (value: NewScheduleItem, disabledScheduleList: number[]) => {
      const newScheduleList: Schedule[] = []
      let isUpdated = false
      const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      const currentWeekDay = scheduleDate.getDay()
      const targetWeekDay = weekdays[currentWeekDay]

      scheduleList.forEach(item => {
        const isDisabled = disabledScheduleList.includes(item.schedule_id)

        if (!isDisabled) {
          if (value.schedule_id === item.schedule_id) {
            isUpdated = true
            // set update item
            if (value[targetWeekDay] === '1') {
              newScheduleList.push({...item, ...value})
            }
          } else {
            newScheduleList.push(item)
          }
        }
      })

      if (!isUpdated) {
        const updateDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        // set insert item
        newScheduleList.push({
          ...value,
          update_date: updateDate,
          routine_list: [],
          todo_list: []
        })
      }

      return newScheduleList.sort((a, b) => a.start_time - b.start_time)
    },
    [scheduleDate, scheduleList]
  )

  const doSubmit = React.useCallback(
    async (disabledScheduleList: number[]) => {
      const isCustomColorThemeChanged = editColorThemeDetail.colorThemeItemList.some(
        item => item.actionType === 'I' || item.actionType === 'U' || item.actionType === 'D'
      )

      if (
        isCustomColorThemeChanged ||
        activeColorThemeDetail.is_active_color_theme !== editColorThemeDetail.isActiveColorTheme
      ) {
        const params: UpdateColorThemeRequest = {
          is_active_color_theme: editColorThemeDetail.isActiveColorTheme ? 1 : 0,
          insert_color_theme_item_list: [],
          update_color_theme_item_list: [],
          delete_color_theme_item_list: []
        }

        if (editColorThemeDetail.isActiveColorTheme) {
          editColorThemeDetail.colorThemeItemList.forEach(item => {
            const param: ColorThemeItem = {
              color_theme_item_id: item.color_theme_item_id,
              background_color: item.background_color,
              text_color: item.text_color,
              order: item.order
            }

            if (item.actionType === 'I') {
              params.insert_color_theme_item_list.push(param)
            } else if (item.actionType === 'U') {
              params.update_color_theme_item_list.push(param)
            } else if (item.actionType === 'D') {
              params.delete_color_theme_item_list.push(param)
            }
          })
        }

        const response = await updateColorThemeMutateAsync(params)

        setActiveColorThemeDetail({
          is_active_color_theme: editColorThemeDetail.isActiveColorTheme,
          color_theme_item_list: response
        })
      }

      const {schedule_id, ...form} = editScheduleForm
      const newEditScheduleForm = {...form, ...editSchedulePosition}

      let newScheduleId = null

      if (schedule_id) {
        const response = await updateScheduleMutateAsync({
          form: newEditScheduleForm,
          disabled_list: disabledScheduleList,
          schedule_id
        })

        newScheduleId = response.schedule_id
      } else {
        const response = await setScheduleMutateAsync({
          form: newEditScheduleForm,
          disabled_list: disabledScheduleList
        })

        newScheduleId = response.schedule_id
      }

      const newScheduleList = getNewScheduleList(
        {...newEditScheduleForm, schedule_id: newScheduleId},
        disabledScheduleList
      )

      const formatDate = format(scheduleDate, 'yyyy-MM-dd')
      queryClient.setQueryData(['scheduleList', formatDate], newScheduleList)

      setReloadWidgetWithImage(true)

      navigation.navigate('MainTabs', {
        screen: 'Home'
      })

      setIsEdit(false)
    },
    [
      queryClient,
      activeColorThemeDetail.is_active_color_theme,
      editColorThemeDetail,
      editScheduleForm,
      editSchedulePosition,
      scheduleDate,
      getNewScheduleList,
      setScheduleMutateAsync,
      updateColorThemeMutateAsync,
      updateScheduleMutateAsync,
      navigation,
      setActiveColorThemeDetail,
      setReloadWidgetWithImage,
      setIsEdit
    ]
  )

  const handleSubmit = React.useCallback(async () => {
    const _overlapScheduleList = await getOverlapScheduleListMutateAsync({
      schedule_id: editScheduleForm.schedule_id || null,
      start_time: editScheduleForm.start_time,
      end_time: editScheduleForm.end_time,
      start_date: editScheduleForm.start_date,
      end_date: editScheduleForm.end_date,
      mon: editScheduleForm.mon,
      tue: editScheduleForm.tue,
      wed: editScheduleForm.wed,
      thu: editScheduleForm.thu,
      fri: editScheduleForm.fri,
      sat: editScheduleForm.sat,
      sun: editScheduleForm.sun
    })

    if (_overlapScheduleList.length > 0) {
      setOverlapScheduleList(_overlapScheduleList)

      setShowOverlapScheduleListBottomSheet(true)
      return
    }

    await doSubmit([])
  }, [editScheduleForm, getOverlapScheduleListMutateAsync, doSubmit])

  React.useEffect(() => {
    if (editScheduleListStatus === 0) {
      timeInfoTranslateX.value = withTiming(-10)
    } else {
      timeInfoTranslateX.value = withTiming(-250)
    }
  }, [editScheduleListStatus])

  React.useEffect(() => {
    timeTableTranslateY.value = withTiming(-editTimetableTranslateY)

    return () => {
      timeTableTranslateY.value = 0
    }
  }, [editTimetableTranslateY])

  React.useLayoutEffect(() => {
    setEditScheduleTime({
      start: editScheduleForm.start_time,
      end: editScheduleForm.end_time
    })
  }, [editScheduleForm.start_time, editScheduleForm.end_time, setEditScheduleTime])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showColorSelectorBottomSheet) {
          setShowColorSelectorBottomSheet(false)
        } else if (showOverlapScheduleListBottomSheet) {
          setShowOverlapScheduleListBottomSheet(false)
        } else {
          closeEditScheduleBottomSheet()
        }
        return true
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => subscription.remove()
    }, [
      closeEditScheduleBottomSheet,
      showColorSelectorBottomSheet,
      showOverlapScheduleListBottomSheet,
      setShowColorSelectorBottomSheet,
      setShowOverlapScheduleListBottomSheet
    ])
  )

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

        <EditTimetable data={scheduleList} colorThemeDetail={colorThemeDetail} />
      </Animated.View>

      {/* control mode 닫기 overlay */}
      {isActiveControlMode && <Pressable style={styles.activeControlModeOverlay} onPress={closeActiveControlMode} />}

      <View style={styles.controlBar}>
        <ControlBar
          ref={controlBarRef}
          data={editScheduleForm}
          displayMode={displayMode === 1 ? 'light' : 'dark'}
          isActiveSubmit={activeSubmit}
          onActiveControlMode={handleActiveControlMode}
          onChange={setEditScheduleForm}
          onSubmit={handleSubmit}
        />
        <View style={{height: 10, backgroundColor: activeTheme.color1}} />
      </View>

      <EditScheduleBottomSheet
        ref={editScheduleBottomSheetRef}
        data={editScheduleForm}
        onChange={setEditScheduleForm}
      />
      <ColorSelectorBottomSheet
        data={editScheduleForm}
        colorThemeDetail={colorThemeDetail}
        editColorThemeDetail={editColorThemeDetail}
        onChange={setEditScheduleForm}
        onChangeEditColorThemeDetail={setEditColorThemeDetail}
      />
      <ColorPickerModal />
      {/*<ScheduleCategorySelectorBottomSheet />*/}
      <OverlapScheduleListBottomSheet
        visible={showOverlapScheduleListBottomSheet}
        data={overlapScheduleList}
        onDismiss={() => setShowOverlapScheduleListBottomSheet(false)}
        onSubmit={doSubmit}
      />
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
    bottom: 0,
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
