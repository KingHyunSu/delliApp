import React, {useRef, useState} from 'react'
import {
  StyleSheet,
  Platform,
  BackHandler,
  ToastAndroid,
  Pressable,
  View,
  Text,
  Image,
  Alert,
  Linking
} from 'react-native'
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

// icons
import PlusIcon from '@/assets/icons/plus.svg'

// stores
import {useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {
  safeAreaInsetsState,
  isEditState,
  editTimetableTranslateYState,
  activeThemeState,
  activeBackgroundState,
  statusBarColorState,
  bottomSafeAreaColorState,
  statusBarTextStyleState,
  systemInfoState,
  widgetReloadableState
} from '@/store/system'
import {
  scheduleDateState,
  scheduleListState,
  disableScheduleListState,
  isInputModeState,
  editScheduleFormState
} from '@/store/schedule'
import {showEditMenuBottomSheetState, showDatePickerBottomSheetState} from '@/store/bottomSheet'
import {reloadWidgetWithImageState} from '@/store/widget'

import {HomeScreenProps} from '@/types/navigation'
import HomeFabExtensionModal from '@/components/modal/HomeFabExtensionModal'
import {useUpdateWidgetWithImage} from '@/utils/hooks/useWidget'

const Home = ({navigation}: HomeScreenProps) => {
  const updateWidgetWithImage = useUpdateWidgetWithImage()
  const safeAreaInsets = useSafeAreaInsets()

  const timetableRef = useRef<Timetable>(null)

  const [isReady, setIsReady] = useState(false)
  const [backPressCount, setBackPressCount] = React.useState(0)
  const [fabIndex, setFabIndex] = useState(0)
  const [showFabExtensionModal, setShowFabExtensionModal] = React.useState(false)

  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const [showDatePickerBottomSheet, setShowDatePickerBottomSheet] = useRecoilState(showDatePickerBottomSheetState)
  const [editScheduleForm, setEditScheduleForm] = useRecoilState(editScheduleFormState)
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)
  const [reloadWidgetWithImage, setReloadWidgetWithImage] = useRecoilState(reloadWidgetWithImageState)

  const systemInfo = useRecoilValue(systemInfoState)
  const scheduleList = useRecoilValue(scheduleListState)
  const activeBackground = useRecoilValue(activeBackgroundState)
  const activeTheme = useRecoilValue(activeThemeState)
  const editTimetableTranslateY = useRecoilValue(editTimetableTranslateYState)
  const widgetReloadable = useRecoilValue(widgetReloadableState)

  const setSafeAreaInsets = useSetRecoilState(safeAreaInsetsState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setStatusBarTextStyle = useSetRecoilState(statusBarTextStyleState)
  const setStatusBarColor = useSetRecoilState(statusBarColorState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)

  const resetEditScheduleForm = useResetRecoilState(editScheduleFormState)
  const resetDisableScheduleList = useResetRecoilState(disableScheduleListState)

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
      setFabIndex(1)
      fabTranslateY.value = withTiming(50)
    } else {
      setFabIndex(0)
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
    if (isEdit) {
      setIsReady(false)
      setIsInputMode(true)
      headerTranslateY.value = withTiming(-200)
    } else {
      setIsInputMode(false)

      timeTableTranslateY.value = editTimetableTranslateY * -1
      headerTranslateY.value = withTiming(0)
      timeTableTranslateY.value = withTiming(0, {duration: 300}, () => {
        runOnJS(setIsReady)(true)
      })

      resetDisableScheduleList()
      resetEditScheduleForm()
    }
  }, [isEdit, editTimetableTranslateY, resetEditScheduleForm, resetDisableScheduleList, setIsInputMode])

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      if (systemInfo.ios_update_required) {
        Alert.alert('업데이트 안내', '최신 버전으로 업데이트 후\n 이용가능합니다.', [
          {
            text: '업데이트',
            onPress: async () => {
              const storeUrl = 'https://apps.apple.com/app/id6447664372'
              //   'https://apps.apple.com/us/app/%EB%8D%B8%EB%A6%AC-%EB%8D%B0%EC%9D%BC%EB%A6%AC-%EC%9D%BC%EC%A0%95-%EA%B4%80%EB%A6%AC/id6447664372'
              const canOpen = await Linking.canOpenURL(storeUrl)

              if (canOpen) {
                await Linking.openURL(storeUrl)
              }
            }
          }
        ])
      }
    } else if (Platform.OS === 'android') {
      if (systemInfo.android_update_required) {
        // google play store 이동
      }
    }
  }, [systemInfo.ios_update_required, systemInfo.android_update_required])

  React.useEffect(() => {
    const updateWidget = async () => {
      const imageUri = await timetableRef.current?.capture()

      if (imageUri) {
        await updateWidgetWithImage(scheduleList, imageUri)
      }
    }

    if (isReady && widgetReloadable && reloadWidgetWithImage) {
      if (Platform.OS === 'ios') {
        // TODO - android 위젯 추가 전까지 ios만 적용
        updateWidget()
        setReloadWidgetWithImage(false)
      }
    }
  }, [isReady, widgetReloadable, reloadWidgetWithImage, scheduleList, updateWidgetWithImage, setReloadWidgetWithImage])

  return (
    <View style={homeStyles.container}>
      {background}

      {/* home header */}
      <Animated.View style={headerStyle}>
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
        <Timetable ref={timetableRef} data={scheduleList} />
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
        fabIndex={fabIndex}
        moveHomeCustom={moveHomeCustom}
        moveEditSchedule={moveEditSchedule}
        onClose={() => setShowFabExtensionModal(false)}
      />
      {/*<TimetableCategoryBottomSheet />*/}
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
