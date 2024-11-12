import React from 'react'
import {Platform, StyleSheet, BackHandler, ToastAndroid, Alert, Pressable, View, Text, Image} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useFocusEffect} from '@react-navigation/native'
import {AdEventType, RewardedAd, RewardedAdEventType, TestIds} from 'react-native-google-mobile-ads'
import Animated, {useSharedValue, useAnimatedStyle, withTiming, runOnJS} from 'react-native-reanimated'
import {format} from 'date-fns'
import RNFetchBlob from 'rn-fetch-blob'

// components
import Loading from '@/components/Loading'
import AppBar from '@/components/AppBar'
import {Timetable} from '@/components/TimeTable'
import EditMenuBottomSheet from '@/components/bottomSheet/EditMenuBottomSheet'
import ScheduleListBottomSheet from '@/components/bottomSheet/ScheduleListBottomSheet'
import DatePickerBottomSheet from '@/components/bottomSheet/DatePickerBottomSheet'
import EditTodoModal from '@/components/modal/EditTodoModal'
import CompleteModal from '@/components/modal/CompleteModal'
// import ScheduleCompleteModal from '@/components/modal/ScheduleCompleteModal'

// icons
import SettingIcon from '@/assets/icons/setting.svg'
import RightArrowIcon from '@/assets/icons/arrow_right.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import PauseIcon from '@/assets/icons/pause.svg'

// stores
import {useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {
  safeAreaInsetsState,
  isLunchState,
  isEditState,
  isLoadingState,
  toastState,
  editTimetableTranslateYState,
  activeThemeState
} from '@/store/system'
import {
  scheduleDateState,
  scheduleState,
  scheduleListState,
  disableScheduleListState,
  isInputModeState,
  focusModeInfoState
} from '@/store/schedule'
import {showEditMenuBottomSheetState, showDatePickerBottomSheetState} from '@/store/bottomSheet'
import {widgetWithImageUpdatedState} from '@/store/widget'

import {getFocusTimeText} from '@/utils/helper'

import {userRepository} from '@/apis/local'
import * as widgetApi from '@/apis/widget'

import {HomeScreenProps} from '@/types/navigation'
import {useGetScheduleList, useSetScheduleFocusTime} from '@/apis/hooks/useSchedule'
import HomeFabExtensionModal from '@/components/modal/HomeFabExtensionModal'

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3765315237132279/5689289144'

const Home = ({navigation, route}: HomeScreenProps) => {
  const {data: _scheduleList, isError} = useGetScheduleList()
  const {mutateAsync: setScheduleFocusTimeMutateAsync} = useSetScheduleFocusTime()

  const safeAreaInsets = useSafeAreaInsets()

  const [isRendered, setIsRendered] = React.useState(false)
  const [backPressCount, setBackPressCount] = React.useState(0)
  const [showFabExtensionModal, setShowFabExtensionModal] = React.useState(false)

  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [showDatePickerBottomSheet, setShowDatePickerBottomSheet] = useRecoilState(showDatePickerBottomSheetState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)

  const activeTheme = useRecoilValue(activeThemeState)
  const focusModeInfo = useRecoilValue(focusModeInfoState)
  const editTimetableTranslateY = useRecoilValue(editTimetableTranslateYState)

  const setIsLunch = useSetRecoilState(isLunchState)
  const setSafeAreaInsets = useSetRecoilState(safeAreaInsetsState)
  const resetSchedule = useResetRecoilState(scheduleState)
  const resetDisableScheduleList = useResetRecoilState(disableScheduleListState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setToast = useSetRecoilState(toastState)
  const setWidgetWithImageUpdated = useSetRecoilState(widgetWithImageUpdatedState)
  const setFocusModeInfo = useSetRecoilState(focusModeInfoState)

  React.useEffect(() => {
    setScheduleList(_scheduleList)
    setIsLunch(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }, [_scheduleList, setScheduleList, setIsLunch, setIsLoading])

  const background = React.useMemo(() => {
    if (activeTheme.theme_id === 1) {
      return <Image style={homeStyles.backgroundImage} source={require('@/assets/white.png')} />
    }

    return (
      <Image
        style={homeStyles.backgroundImage}
        source={{uri: `file://${RNFetchBlob.fs.dirs.DocumentDir}/${activeTheme.file_name}`}}
      />
    )
  }, [activeTheme.theme_id, activeTheme.file_name])

  const currentScheduleDateString = React.useMemo(() => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const dayOfWeekIndex = scheduleDate.getDay()

    return format(scheduleDate, 'yyyy년 MM월 dd일') + ' ' + `${weekdays[dayOfWeekIndex]}요일`
  }, [scheduleDate, format])

  const changeScheduleDate = React.useCallback(
    (date: string) => {
      setScheduleDate(new Date(date))
    },
    [setScheduleDate]
  )

  const moveMyThemeList = React.useCallback(() => {
    navigation.navigate('MyThemeList')
  }, [navigation])

  const moveEditSchedule = React.useCallback(() => {
    setIsEdit(true)

    if (!schedule.schedule_id) {
      setSchedule(prevState => ({
        ...prevState,
        // timetable_category_id: activeTimeTableCategory.timetable_category_id,
        start_date: format(scheduleDate, 'yyyy-MM-dd')
      }))
    }

    navigation.navigate('EditSchedule')
  }, [schedule.schedule_id, scheduleDate, setSchedule, setIsEdit, navigation])

  const openEditMenuBottomSheet = React.useCallback(
    (value: Schedule) => {
      setSchedule(value)
      setShowEditMenuBottomSheet(true)
    },
    [setSchedule, setShowEditMenuBottomSheet]
  )

  const handleStopFocusTime = React.useCallback(async () => {
    const newScheduleActivityLogId = await setScheduleFocusTimeMutateAsync()

    setSchedule(prevState => ({
      ...prevState,
      schedule_activity_log_id: newScheduleActivityLogId,
      active_time: focusModeInfo?.seconds || 0
    }))

    setScheduleList(prevState => {
      const targetIndex = prevState.findIndex(item => item.schedule_id === focusModeInfo?.schedule_id)

      if (targetIndex !== -1) {
        const updateList = [...prevState]

        updateList[targetIndex] = {
          ...updateList[targetIndex],
          schedule_activity_log_id: newScheduleActivityLogId,
          active_time: focusModeInfo?.seconds || 0
        }
        return updateList
      }

      return prevState
    })

    setFocusModeInfo(null)
  }, [focusModeInfo, setScheduleFocusTimeMutateAsync, setSchedule, setScheduleList, setFocusModeInfo])

  const changeScheduleListBottomSheetAnimate = React.useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex === 1) {
      fabTranslateY.value = withTiming(50)
    } else {
      fabTranslateY.value = withTiming(0)
    }
  }, [])

  const headerTranslateY = useSharedValue(0)
  const timeTableTranslateY = useSharedValue(0)
  const fabTranslateY = useSharedValue(0)

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: headerTranslateY.value}]
  }))
  const timetableAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: timeTableTranslateY.value}]
  }))
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: fabTranslateY.value}]
  }))

  const headerStyle = React.useMemo(() => {
    return [headerAnimatedStyle, homeStyles.homeHeaderContainer]
  }, [])
  const timetableStyle = React.useMemo(() => {
    return [timetableAnimatedStyle]
  }, [])
  const fabContainerStyle = React.useMemo(() => {
    return [homeStyles.fabContainer, fabAnimatedStyle]
  }, [])

  // android 뒤로가기 제어
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEdit) {
          // edit bottom sheet
        } else if (showEditMenuBottomSheet) {
          // edit menu bottom sheet
          setShowEditMenuBottomSheet(false)
        } else if (showDatePickerBottomSheet) {
          setShowDatePickerBottomSheet(false)
        } else {
          // home screen
          if (backPressCount === 1) {
            // 앱 종료
            return false
          }

          setBackPressCount(1)
          ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT)

          setTimeout(() => {
            setBackPressCount(0)
          }, 2000)
        }
        return true
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => subscription.remove()
    }, [
      isEdit,
      showEditMenuBottomSheet,
      showDatePickerBottomSheet,
      backPressCount,
      setShowEditMenuBottomSheet,
      setShowDatePickerBottomSheet
    ])
  )

  React.useEffect(() => {
    setSafeAreaInsets(safeAreaInsets)
  }, [])

  React.useEffect(() => {
    const path = route.path
    const params = route.params

    if (params?.scheduleUpdated) {
      setWidgetWithImageUpdated(true)
    } else if (path === 'widget/reload') {
      const rewardedAd = RewardedAd.createForAdRequest(adUnitId)

      setScheduleDate(new Date())

      // 광고 로드 완료
      const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, async () => {
        const user = await userRepository.getUser()
        const params = {id: user.user_id}
        const response = await widgetApi.getWidgetReloadable(params)

        if (!response.data.widget_reloadable) {
          Alert.alert('광고 시청하고\n위젯 새로고침', '', [
            {
              text: '취소',
              style: 'cancel'
            },
            {
              text: '새로고침',
              onPress: () => {
                rewardedAd.show()
              }
            }
          ])
        }
      })

      // 광고 시청 완료
      const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async reward => {
        const user = await userRepository.getUser()
        const params = {id: user.user_id}
        await widgetApi.updateWidgetReloadable(params)

        setWidgetWithImageUpdated(true)
      })

      // 광고 닫힘
      const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        setToast({visible: true, message: '위젯 새로고침 완료'})
      })

      // Start loading the rewarded ad straight away
      rewardedAd.load()

      // Unsubscribe from events on unmount
      return () => {
        unsubscribeLoaded()
        unsubscribeEarned()
        unsubscribeClosed()
      }
    }
  }, [route])

  React.useEffect(() => {
    if (isEdit) {
      setIsRendered(false)
      setIsInputMode(true)
      headerTranslateY.value = withTiming(-200)
    } else {
      timeTableTranslateY.value = editTimetableTranslateY * -1
      resetDisableScheduleList()
      setIsInputMode(false)
      headerTranslateY.value = withTiming(0)
      timeTableTranslateY.value = withTiming(0, {duration: 300}, () => {
        runOnJS(setIsRendered)(true)
      })
      resetSchedule()
    }
  }, [isEdit, editTimetableTranslateY, resetSchedule, resetDisableScheduleList, setIsInputMode])

  React.useEffect(() => {
    if (isError) {
      setIsLoading(false)
    }
  }, [isError, setIsLoading])

  return (
    <View style={homeStyles.container}>
      {background}

      {/* home header */}
      <Animated.View style={headerStyle}>
        <AppBar color="transparent">
          {/* [TODO] 2023-10-28 카테고리 기능 보완하여 오픈 */}
          {/* {activeTimeTableCategory.timetable_category_id ? (
            <Pressable
              style={homeStyles.timetableCategoryButton}
              onPress={() => setShowTimeTableCategoryBottomSheet(true)}>
              <Text style={homeStyles.timetableCategoryText} numberOfLines={1}>
                {activeTimeTableCategory.title}
              </Text>
              <ArrowDownIcon stroke="#000" />
            </Pressable>
          ) : (
            <View />
          )} */}

          <View />

          {/*<Pressable style={homeStyles.appBarRightButton} onPress={() => navigation.navigate('Setting')}>*/}
          {/*  <SettingIcon fill="#babfc5" />*/}
          {/*</Pressable>*/}
        </AppBar>

        <View style={homeStyles.dateButtonWrapper}>
          <Pressable style={homeStyles.dateButton} onPress={() => setShowDatePickerBottomSheet(true)}>
            <Text style={[homeStyles.dateButtonText, {color: activeTheme.color3}]}>{currentScheduleDateString}</Text>
            {/*<RightArrowIcon stroke="#424242" strokeWidth={3} />*/}
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View style={timetableStyle}>
        <Timetable data={scheduleList} isRendered={isRendered} />
      </Animated.View>

      <ScheduleListBottomSheet
        data={scheduleList}
        onClick={openEditMenuBottomSheet}
        onAnimate={changeScheduleListBottomSheetAnimate}
      />

      {focusModeInfo ? (
        <Animated.View style={fabContainerStyle}>
          <Animated.Text style={homeStyles.focusTimeText}>{getFocusTimeText(focusModeInfo.seconds)}</Animated.Text>

          <Pressable style={focusTimeFabStyle} onPress={handleStopFocusTime}>
            <PauseIcon stroke="#ffffff" />
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View style={fabContainerStyle}>
          <Pressable style={scheduleFabStyle} onPress={() => setShowFabExtensionModal(true)}>
            <PlusIcon stroke="#ffffff" strokeWidth={3} />
          </Pressable>
        </Animated.View>
      )}

      <EditMenuBottomSheet moveEditSchedule={moveEditSchedule} />
      <DatePickerBottomSheet value={format(scheduleDate, 'yyyy-MM-dd')} onChange={changeScheduleDate} />
      <EditTodoModal />
      <CompleteModal />
      <HomeFabExtensionModal
        visible={showFabExtensionModal}
        translateY={fabTranslateY.value}
        moveMyThemeList={moveMyThemeList}
        moveEditSchedule={moveEditSchedule}
        onClose={() => setShowFabExtensionModal(false)}
      />
      {/*<TimetableCategoryBottomSheet />*/}
      {/* <ScheduleCompleteModal /> */}

      <Loading />
    </View>
  )
}

const homeStyles = StyleSheet.create({
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
  homeHeaderContainer: {
    // zIndex: -1
  },
  dateButtonWrapper: {
    paddingHorizontal: 16
  },
  dateButton: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateButtonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22
  },
  timetableCategoryButton: {
    width: 150,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  timetableCategoryText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#000'
  },
  appBarRightButton: {
    width: 36,
    height: 36,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  fabContainer: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    gap: 5,
    alignItems: 'center'
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center'
  },
  focusTimeText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#424242'
  }
})

const scheduleFabStyle = StyleSheet.compose(homeStyles.fab, {backgroundColor: '#424242'})
const focusTimeFabStyle = StyleSheet.compose(homeStyles.fab, {backgroundColor: '#FF7043'})

export default Home
