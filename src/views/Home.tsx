import React from 'react'
import {Platform, StyleSheet, LayoutChangeEvent, BackHandler, ToastAndroid, Alert, Pressable, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useFocusEffect} from '@react-navigation/native'
import {AdEventType, RewardedAd, RewardedAdEventType, TestIds} from 'react-native-google-mobile-ads'
import Animated, {useSharedValue, useAnimatedStyle, withTiming, runOnJS} from 'react-native-reanimated'
import {useQuery, useMutation} from '@tanstack/react-query'
import {format} from 'date-fns'

// components
import Loading from '@/components/Loading'
import AppBar from '@/components/AppBar'
import {Timetable} from '@/components/TimeTable'
import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import EditMenuBottomSheet from '@/views/BottomSheet/EditMenuBottomSheet'
import ScheduleListBottomSheet from '@/views/BottomSheet/ScheduleListBottomSheet'
import EditTodoModal from '@/views/Modal/EditTodoModal'
import CompleteModal from '@/views/Modal/CompleteModal'
// import ScheduleCompleteModal from '@/views/Modal/ScheduleCompleteModal'

// icons
// import EditIcon from '@/assets/icons/edit3.svg'
import SettingIcon from '@/assets/icons/setting.svg'
import PlusIcon from '@/assets/icons/plus.svg'

// stores
import {useRecoilState, useSetRecoilState, useResetRecoilState} from 'recoil'
import {
  safeAreaInsetsState,
  isLunchState,
  isEditState,
  isLoadingState,
  homeHeaderHeightState,
  toastState
} from '@/store/system'
import {
  scheduleDateState,
  scheduleState,
  scheduleListState,
  disableScheduleListState,
  isInputModeState
} from '@/store/schedule'
import {showEditMenuBottomSheetState, showDatePickerBottomSheetState} from '@/store/bottomSheet'
import {widgetWithImageUpdatedState} from '@/store/widget'

import {getScheduleList} from '@/utils/schedule'
import {userRepository, scheduleRepository} from '@/repository'

import * as widgetApi from '@/apis/widget'

import {HomeScreenProps} from '@/types/navigation'

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3765315237132279/5689289144'

const Home = ({navigation, route}: HomeScreenProps) => {
  const safeAreaInsets = useSafeAreaInsets()

  const [isRendered, setIsRendered] = React.useState(false)
  const [backPressCount, setBackPressCount] = React.useState(0)

  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [showDatePickerBottomSheet, setShowDatePickerBottomSheet] = useRecoilState(showDatePickerBottomSheetState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)

  const setIsLunch = useSetRecoilState(isLunchState)
  const setSafeAreaInsets = useSetRecoilState(safeAreaInsetsState)
  const setHomeHeaderHeight = useSetRecoilState(homeHeaderHeightState)
  const resetSchedule = useResetRecoilState(scheduleState)
  const resetDisableScheduleList = useResetRecoilState(disableScheduleListState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setToast = useSetRecoilState(toastState)
  const setWidgetWithImageUpdated = useSetRecoilState(widgetWithImageUpdatedState)

  // ---------------------------------------------------------------------
  // apis start
  // ---------------------------------------------------------------------
  const {isError, refetch: refetchScheduleList} = useQuery({
    queryKey: ['scheduleList', scheduleDate],
    queryFn: async () => {
      setIsLoading(true)

      const newScheduleList = await getScheduleList(scheduleDate)

      setScheduleList(newScheduleList)
      setIsLunch(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)

      return newScheduleList
    },
    initialData: []
  })

  const {mutate: updateScheduleDeletedMutate} = useMutation({
    mutationFn: async (data: ScheduleDisableReqeust) => {
      await scheduleRepository.updateScheduleDeleted(data)
    },
    onSuccess: async () => {
      await refetchScheduleList()

      if (Platform.OS === 'ios') {
        setWidgetWithImageUpdated(true)
      }

      resetSchedule()
      setShowEditMenuBottomSheet(false)
    }
  })
  // ---------------------------------------------------------------------
  // apis end
  // ---------------------------------------------------------------------

  const openEditScheduleBottomSheet = React.useCallback(() => {
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

  const handleTopLayout = React.useCallback(
    (layout: LayoutChangeEvent) => {
      setHomeHeaderHeight(layout.nativeEvent.layout.height)
    },
    [setHomeHeaderHeight]
  )

  const headerTranslateY = useSharedValue(0)
  const timeTableTranslateY = useSharedValue(0)

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: headerTranslateY.value}]
  }))
  const timetableAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: timeTableTranslateY.value}]
  }))

  const headerStyle = React.useMemo(() => {
    return [headerAnimatedStyle, homeStyles.homeHeaderContainer]
  }, [])
  const timetableStyle = React.useMemo(() => {
    return [timetableAnimatedStyle]
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
        const [user] = await userRepository.getUser()
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
        const [user] = await userRepository.getUser()
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
    const dateBarHeight = 36

    if (isEdit) {
      setIsRendered(false)
      setIsInputMode(true)
      headerTranslateY.value = withTiming(-200)
    } else {
      timeTableTranslateY.value = -dateBarHeight
      resetDisableScheduleList()
      setIsInputMode(false)
      headerTranslateY.value = withTiming(0)
      timeTableTranslateY.value = withTiming(0, {duration: 300}, () => {
        runOnJS(setIsRendered)(true)
      })
      resetSchedule()
    }
  }, [isEdit, resetSchedule, resetDisableScheduleList, setIsInputMode])

  React.useEffect(() => {
    if (isError) {
      setIsLoading(false)
    }
  }, [isError, setIsLoading])

  return (
    <View style={homeStyles.container}>
      {/* insert header */}

      {/* home header */}
      <Animated.View style={headerStyle} onLayout={handleTopLayout}>
        <AppBar>
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

          <Pressable style={homeStyles.appBarRightButton} onPress={() => navigation.navigate('Setting')}>
            <SettingIcon fill="#babfc5" />
          </Pressable>
        </AppBar>

        <View style={homeStyles.weekDatePickerSection}>
          <WeeklyDatePicker />
        </View>
      </Animated.View>

      <Animated.View style={timetableStyle}>
        <Timetable data={scheduleList} isRendered={isRendered} />
      </Animated.View>

      <ScheduleListBottomSheet data={scheduleList} onClick={openEditMenuBottomSheet} />

      <Pressable style={homeStyles.fabContainer} onPress={openEditScheduleBottomSheet}>
        <PlusIcon stroke="#fff" />
      </Pressable>

      <EditMenuBottomSheet
        updateScheduleDeletedMutate={updateScheduleDeletedMutate}
        openEditScheduleBottomSheet={openEditScheduleBottomSheet}
      />
      <EditTodoModal />
      <CompleteModal />
      {/*<TimetableCategoryBottomSheet />*/}
      {/* <ScheduleCompleteModal /> */}

      <Loading />
    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  homeHeaderContainer: {
    zIndex: -1
  },
  weekDatePickerSection: {
    paddingHorizontal: 16,
    justifyContent: 'center'
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
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      android: {
        elevation: 3
      }
    })
  }
})

export default Home
