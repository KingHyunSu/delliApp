import React from 'react'
import {StyleSheet, BackHandler, ToastAndroid, Alert, Pressable, View, Text, Image} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useFocusEffect} from '@react-navigation/native'
import Animated, {useSharedValue, useAnimatedStyle, withTiming, runOnJS} from 'react-native-reanimated'
import {format} from 'date-fns'

// components
import AppBar from '@/components/AppBar'
import {Timetable} from '@/components/TimeTable'
import EditMenuBottomSheet from '@/components/bottomSheet/EditMenuBottomSheet'
import ScheduleListBottomSheet from '@/components/bottomSheet/ScheduleListBottomSheet'
import DatePickerBottomSheet from '@/components/bottomSheet/DatePickerBottomSheet'
import CompleteModal from '@/components/modal/CompleteModal'
// import ScheduleCompleteModal from '@/components/modal/ScheduleCompleteModal'

// icons
import PlusIcon from '@/assets/icons/plus.svg'

// stores
import {useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {
  safeAreaInsetsState,
  isEditState,
  isLoadingState,
  editTimetableTranslateYState,
  activeThemeState,
  activeBackgroundState,
  statusBarColorState,
  bottomSafeAreaColorState,
  statusBarTextStyleState
} from '@/store/system'
import {
  scheduleDateState,
  scheduleListState,
  disableScheduleListState,
  isInputModeState,
  editScheduleFormState
} from '@/store/schedule'
import {showEditMenuBottomSheetState, showDatePickerBottomSheetState} from '@/store/bottomSheet'
import {widgetWithImageUpdatedState} from '@/store/widget'

import {HomeScreenProps} from '@/types/navigation'
import {useGetCurrentScheduleList} from '@/apis/hooks/useSchedule'
import HomeFabExtensionModal from '@/components/modal/HomeFabExtensionModal'

const Home = ({navigation, route}: HomeScreenProps) => {
  const {data: _scheduleList, isError} = useGetCurrentScheduleList()

  const safeAreaInsets = useSafeAreaInsets()

  const [isRendered, setIsRendered] = React.useState(false)
  const [backPressCount, setBackPressCount] = React.useState(0)
  const [showFabExtensionModal, setShowFabExtensionModal] = React.useState(false)

  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [showDatePickerBottomSheet, setShowDatePickerBottomSheet] = useRecoilState(showDatePickerBottomSheetState)
  const [editScheduleForm, setEditScheduleForm] = useRecoilState(editScheduleFormState)

  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)

  const activeBackground = useRecoilValue(activeBackgroundState)
  const activeTheme = useRecoilValue(activeThemeState)
  const editTimetableTranslateY = useRecoilValue(editTimetableTranslateYState)

  const setSafeAreaInsets = useSetRecoilState(safeAreaInsetsState)
  const resetEditScheduleForm = useResetRecoilState(editScheduleFormState)
  const resetDisableScheduleList = useResetRecoilState(disableScheduleListState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setWidgetWithImageUpdated = useSetRecoilState(widgetWithImageUpdatedState)
  const setStatusBarTextStyle = useSetRecoilState(statusBarTextStyleState)
  const setStatusBarColor = useSetRecoilState(statusBarColorState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)

  React.useEffect(() => {
    setScheduleList(_scheduleList)

    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }, [_scheduleList, setScheduleList, setIsLoading])

  const background = React.useMemo(() => {
    if (!activeBackground || activeBackground.background_id === 1) {
      return <Image style={homeStyles.backgroundImage} source={require('@/assets/beige.png')} />
      // return <View style={{backgroundColor: '#F8ECE4', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
    }

    return <Image style={homeStyles.backgroundImage} source={{uri: activeBackground.main_url}} />
  }, [activeBackground])

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

  const moveHomeCustom = React.useCallback(() => {
    navigation.navigate('HomeCustom')
  }, [navigation])

  const moveEditSchedule = React.useCallback(() => {
    setIsEdit(true)

    if (!editScheduleForm.schedule_id) {
      setEditScheduleForm(prevState => ({
        ...prevState,
        start_date: format(scheduleDate, 'yyyy-MM-dd')
      }))
    }

    navigation.navigate('EditSchedule')
  }, [editScheduleForm.schedule_id, scheduleDate, setEditScheduleForm, setIsEdit, navigation])

  const openEditMenuBottomSheet = React.useCallback(
    (value: Schedule) => {
      setEditScheduleForm(value)
      setShowEditMenuBottomSheet(true)
    },
    [setEditScheduleForm, setShowEditMenuBottomSheet]
  )

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

  useFocusEffect(
    React.useCallback(() => {
      setStatusBarTextStyle(activeBackground.display_mode === 1 ? 'dark-content' : 'light-content')
      setStatusBarColor(activeBackground.background_color)
      setBottomSafeAreaColor(activeTheme.color5)

      const onBackPress = () => {
        if (showEditMenuBottomSheet) {
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
      activeBackground.display_mode,
      activeBackground.background_color,
      activeTheme.color5,
      showEditMenuBottomSheet,
      showDatePickerBottomSheet,
      backPressCount,
      setStatusBarTextStyle,
      setStatusBarColor,
      setBottomSafeAreaColor,
      setShowEditMenuBottomSheet,
      setShowDatePickerBottomSheet
    ])
  )

  React.useEffect(() => {
    setSafeAreaInsets(safeAreaInsets)
  }, [safeAreaInsets, setSafeAreaInsets])

  React.useEffect(() => {
    const params = route.params

    if (params?.scheduleUpdated) {
      setWidgetWithImageUpdated(true)
    }
  }, [route.params, setWidgetWithImageUpdated])

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
      resetEditScheduleForm()
    }
  }, [isEdit, editTimetableTranslateY, resetEditScheduleForm, resetDisableScheduleList, setIsInputMode])

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
            <Text style={[homeStyles.dateButtonText, {color: activeBackground.accent_color}]}>
              {currentScheduleDateString}
            </Text>
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

      <Animated.View style={fabContainerStyle}>
        <Pressable style={homeStyles.fab} onPress={() => setShowFabExtensionModal(true)}>
          <PlusIcon stroke="#ffffff" strokeWidth={3} />
        </Pressable>
      </Animated.View>

      <EditMenuBottomSheet moveEditSchedule={moveEditSchedule} />
      <DatePickerBottomSheet value={format(scheduleDate, 'yyyy-MM-dd')} onChange={changeScheduleDate} />
      <CompleteModal />
      <HomeFabExtensionModal
        visible={showFabExtensionModal}
        translateY={fabTranslateY.value}
        moveHomeCustom={moveHomeCustom}
        moveEditSchedule={moveEditSchedule}
        onClose={() => setShowFabExtensionModal(false)}
      />
      {/*<TimetableCategoryBottomSheet />*/}
      {/* <ScheduleCompleteModal /> */}
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
    alignItems: 'center',
    backgroundColor: '#1E90FF'
  },
  focusTimeText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#424242'
  }
})

export default Home
