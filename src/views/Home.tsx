import React from 'react'
import {
  Platform,
  Animated,
  StyleSheet,
  NativeModules,
  LayoutChangeEvent,
  Alert,
  SafeAreaView,
  Pressable,
  View,
  Text
} from 'react-native'
import RNFS from 'react-native-fs'
import {format, getDay, getTime} from 'date-fns'
import {useQuery, useMutation} from '@tanstack/react-query'
import {RewardedAd, RewardedAdEventType, TestIds} from 'react-native-google-mobile-ads'

import Loading from '@/components/Loading'
import AppBar from '@/components/AppBar'
import TimeTable from '@/components/TimeTable'
import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import EditMenuBottomSheet from '@/views/BottomSheet/EditMenuBottomSheet'
import EditScheduleBottomSheet from '@/views/BottomSheet/EditScheduleBottomSheet'
import EditScheduleCheckBottomSheet from '@/views/BottomSheet/EditScheduleCheckBottomSheet'
import ScheduleListBottomSheet from '@/views/BottomSheet/ScheduleListBottomSheet'
import TimetableCategoryBottomSheet from '@/views/BottomSheet/TimetableCategoryBottomSheet'
import StyleBottomSheet from '@/views/BottomSheet/StyleBottomSheet'
import EditTodoModal from '@/views/Modal/EditTodoModal'
import TimeTableExternal, {TimeTableExternalRefs} from '@/components/TimeTableExternal'
// import ScheduleCompleteModal from '@/views/Modal/ScheduleCompleteModal'

import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import SettingIcon from '@/assets/icons/setting.svg'
import CancleIcon from '@/assets/icons/cancle.svg'
// import EditIcon from '@/assets/icons/edit3.svg'
import PlusIcon from '@/assets/icons/plus.svg'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {isLunchState, isEditState, isLoadingState, homeHeaderHeightState} from '@/store/system'
import {
  scheduleDateState,
  scheduleState,
  scheduleListState,
  disableScheduleListState,
  existScheduleListState,
  isInputModeState
} from '@/store/schedule'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {showEditMenuBottomSheetState, showEditScheduleCheckBottomSheetState} from '@/store/bottomSheet'

import {getDayOfWeekKey} from '@/utils/helper'

import {HomeNavigationProps} from '@/types/navigation'

// repository
import {scheduleRepository} from '@/repository'

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy'
const rewardedAd = RewardedAd.createForAdRequest(adUnitId)

const Home = ({navigation, route}: HomeNavigationProps) => {
  const {AppGroupModule, WidgetUpdaterModule} = NativeModules
  const timeTableExternalRef = React.useRef<TimeTableExternalRefs>(null)

  const setIsLunch = useSetRecoilState(isLunchState)
  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const [scheduleDate, setScheduleDate] = useRecoilState(scheduleDateState)
  const [activeTimeTableCategory, setActiveTimeTableCategory] = useRecoilState(activeTimeTableCategoryState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const disableScheduleList = useRecoilValue(disableScheduleListState)

  const setHomeHeaderHeight = useSetRecoilState(homeHeaderHeightState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)
  const resetSchedule = useResetRecoilState(scheduleState)
  const resetDisableScheduleList = useResetRecoilState(disableScheduleListState)
  const setExistScheduleList = useSetRecoilState(existScheduleListState)
  const setShowEditScheduleCheckBottomSheet = useSetRecoilState(showEditScheduleCheckBottomSheetState)
  const setIsInputMode = useSetRecoilState(isInputModeState)

  const updateWidget = React.useCallback(async () => {
    if (timeTableExternalRef.current) {
      const newScheduleList = [...scheduleList]
      const timeTableExternalImageUri = await timeTableExternalRef.current.getImage()

      const fileName = 'timetable.png'
      const appGroupPath = await AppGroupModule.getAppGroupPath()
      const path = appGroupPath + '/' + fileName
      console.log('path2', path)
      const existImage = await RNFS.exists(path)

      if (existImage) {
        await RNFS.unlink(path)
      }
      await RNFS.moveFile(timeTableExternalImageUri, path)

      let widgetScheduleList: WidgetSchedule[] = []

      if (newScheduleList && newScheduleList.length > 0) {
        for (let i = 0; i < newScheduleList.length - 1; i++) {
          const currentWidgetSchedule = newScheduleList[i]
          const nextWidgetSchedule = newScheduleList[i + 1]

          widgetScheduleList.push(currentWidgetSchedule)

          if (currentWidgetSchedule.end_time !== nextWidgetSchedule.start_time) {
            widgetScheduleList.push({
              schedule_id: null,
              title: '',
              start_time: currentWidgetSchedule.end_time,
              end_time: nextWidgetSchedule.start_time
            })
          }
        }

        widgetScheduleList.push(newScheduleList[newScheduleList.length - 1])
      }

      console.log('widgetScheduleList', widgetScheduleList)
      const widgetScheduleListJsonString = JSON.stringify(widgetScheduleList)

      WidgetUpdaterModule.updateWidget(widgetScheduleListJsonString)
    }
  },[scheduleList])

  const {isError, refetch: refetchScheduleList} = useQuery<Schedule[]>({
    queryKey: ['scheduleList', scheduleDate],
    queryFn: async () => {
      setIsLoading(true)

      const date = format(scheduleDate, 'yyyy-MM-dd')
      const dayOfWeek = getDayOfWeekKey(scheduleDate.getDay())
      const params = {
        date,
        mon: '',
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        sat: '',
        sun: '',
        disable: '0'
      }

      if (dayOfWeek) {
        params[dayOfWeek] = '1'
      }

      let result = await scheduleRepository.getScheduleList(params)

      result = result.map(item => {
        return {
          ...item,
          todo_list: JSON.parse(item.todo_list)
        }
      })

      console.log('result', result)

      setScheduleList(result)
      setIsLunch(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)

      return result
    },
    initialData: []
  })

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
        sun: schedule.sun
      }

      return await scheduleRepository.getExistScheduleList(params)
    }
  })

  const {mutate: setScheduleMutate} = useMutation({
    mutationFn: async () => {
      const params = {schedule}

      if (params.schedule.schedule_id) {
        await scheduleRepository.updateSchedule(params)
      } else {
        await scheduleRepository.setSchedule(params)
      }
    },
    onSuccess: async () => {
      // const {data: newScheduleList} = await refetchScheduleList()
      const shouldWidgetReload = await WidgetUpdaterModule.shouldWidgetReload()
      console.log('shouldWidgetReload', shouldWidgetReload)
      if (!shouldWidgetReload) {
        await updateWidget()
      }
      setIsEdit(false)
    },
    onError: e => {
      console.error('error', e)
    }
  })

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

  const containerStyle = React.useMemo(() => {
    let color = '#ffffff'

    if (isEdit) {
      color = activeSubmit ? '#1E90FF' : '#f5f6f8'
    } else {
      color = '#ffffff'
    }

    return [homeStyles.container, {backgroundColor: color}]
  }, [activeSubmit, isEdit])

  const submitButtonStyle = React.useMemo(() => {
    return [homeStyles.submitButton, activeSubmit && homeStyles.activeSubmitBtn]
  }, [activeSubmit])

  const submitTextStyle = React.useMemo(() => {
    return [homeStyles.submitText, activeSubmit && homeStyles.activeSubmitText]
  }, [activeSubmit])

  const handleSubmit = React.useCallback(async () => {
    const existScheduleList = await getExistScheduleListMutateAsync()

    setExistScheduleList(existScheduleList)

    if (existScheduleList.length > 0 || disableScheduleList.length > 0) {
      setShowEditScheduleCheckBottomSheet(true)
      return
    }

    setScheduleMutate()
  }, [
    getExistScheduleListMutateAsync,
    setScheduleMutate,
    setExistScheduleList,
    setShowEditScheduleCheckBottomSheet,
    disableScheduleList.length
  ])

  const openEditScheduleBottomSheet = React.useCallback(
    (value?: Schedule) => () => {
      if (value) {
        setSchedule(value)
      } else {
        const dayOfWeekKeyList = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

        let currentDayOfWeekIndex = getDay(new Date(scheduleDate)) - 1

        if (currentDayOfWeekIndex === -1) {
          currentDayOfWeekIndex = 6
        }

        const dayOfWeekkey = dayOfWeekKeyList[currentDayOfWeekIndex]

        setSchedule(prevState => {
          return {
            ...prevState,
            // timetable_category_id: activeTimeTableCategory.timetable_category_id,
            start_date: format(scheduleDate, 'yyyy-MM-dd'),
            [dayOfWeekkey]: '1'
          }
        })
      }

      setIsEdit(true)
    },
    [scheduleDate, setIsEdit, setSchedule]
  )

  const openEditMenuBottomSheet = React.useCallback(
    (value: Schedule) => {
      setSchedule(value)
      setShowEditMenuBottomSheet(true)
    },
    [setSchedule, setShowEditMenuBottomSheet]
  )

  const closeEditScheduleBottomSheet = React.useCallback(() => {
    setIsEdit(false)
  }, [setIsEdit])

  const handleTopLayout = React.useCallback(
    (layout: LayoutChangeEvent) => {
      setHomeHeaderHeight(layout.nativeEvent.layout.height)
    },
    [setHomeHeaderHeight]
  )

  const headerTranslateY = React.useRef(new Animated.Value(0)).current
  const timaTableTranslateY = React.useRef(new Animated.Value(0)).current

  const translateAnimation = (target: Animated.Value, to: number, duration?: number) => {
    Animated.timing(target, {
      toValue: to,
      duration: duration ? duration : 300,
      useNativeDriver: true
    }).start()
  }

  React.useEffect(() => {
    console.log('mount', scheduleList)
    const path = route.path
    if (path === 'widget/reload') {
      console.log('path', path)
      setScheduleDate(new Date())

      // 광고 로드 완료
      const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        Alert.alert('광고 시청하고\n새로운 생활계획표 생성하기', '', [
          {
            text: '취소',
            onPress: () => {
              return
            },
            style: 'cancel'
          },
          {
            text: '생성하기',
            onPress: () => {
              rewardedAd.show()
            }
          }
        ])
      })

      // 광고 시청 완료
      const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async reward => {
        console.log('User earned reward of ', reward)
        console.log('reward scheduleList', scheduleList)
        await updateWidget()
      })

      // Start loading the rewarded ad straight away
      rewardedAd.load()

      // Unsubscribe from events on unmount
      return () => {
        console.log('unmount')
        unsubscribeLoaded()
        unsubscribeEarned()
      }
    }
  }, [route.path])

  React.useEffect(() => {
    if (isEdit) {
      translateAnimation(headerTranslateY, -200, 350)
      translateAnimation(timaTableTranslateY, -100)
    } else {
      resetDisableScheduleList()
      setIsInputMode(false)
      translateAnimation(headerTranslateY, 0, 350)
      translateAnimation(timaTableTranslateY, 0)
      resetSchedule()
    }
  }, [isEdit, headerTranslateY, timaTableTranslateY, resetSchedule, resetDisableScheduleList, setIsInputMode])

  React.useEffect(() => {
    if (isError) {
      setIsLoading(false)
    }
  }, [isError, setIsLoading])

  return (
    <SafeAreaView style={containerStyle}>
      <View style={homeStyles.wrapper}>
        {/* insert header */}
        <View style={homeStyles.insertHeaderContainer}>
          <AppBar>
            {/* [TODO] 2023-10-28 카테고리 기능 보완하여 오픈 */}
            {/* <Text style={homeStyles.timetableCategoryText}>{activeTimeTableCategory.title}</Text> */}
            <View />

            <Pressable style={homeStyles.appBarRightButton} onPress={closeEditScheduleBottomSheet}>
              <CancleIcon stroke="#242933" />
            </Pressable>
          </AppBar>
        </View>

        {/* home header */}
        <Animated.View
          style={[homeStyles.homeHeaderContainer, {transform: [{translateY: headerTranslateY}]}]}
          onLayout={handleTopLayout}>
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

        <Animated.View style={[{transform: [{translateY: timaTableTranslateY}], opacity: isLoading ? 0.6 : 1}]}>
          <TimeTable data={scheduleList} isEdit={isEdit} />
        </Animated.View>

        <ScheduleListBottomSheet
          data={scheduleList}
          openEditScheduleBottomSheet={openEditScheduleBottomSheet}
          onClick={openEditMenuBottomSheet}
        />
        <EditScheduleBottomSheet />
        <EditScheduleCheckBottomSheet refetchScheduleList={refetchScheduleList} />

        {/* bottom buttons */}
        {isEdit ? (
          <Pressable style={submitButtonStyle} onPress={handleSubmit} disabled={!activeSubmit}>
            <Text style={submitTextStyle}>{schedule.schedule_id ? '수정하기' : '등록하기'}</Text>
          </Pressable>
        ) : (
          <Pressable style={homeStyles.fabContainer} onPress={openEditScheduleBottomSheet()}>
            <PlusIcon stroke="#fff" />
          </Pressable>
        )}

        {/* bottom sheet */}
        <EditMenuBottomSheet refetchScheduleList={refetchScheduleList} />
        <TimetableCategoryBottomSheet />
        <StyleBottomSheet />

        {/* modal */}
        {/* <ScheduleCompleteModal /> */}
        <EditTodoModal />

        <Loading />
      </View>

      {/*  external timetable */}
      <TimeTableExternal ref={timeTableExternalRef} data={scheduleList} options={{width: 400, height: 400}} />
    </SafeAreaView>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff'
  },
  homeHeaderContainer: {
    zIndex: -1,
    backgroundColor: '#fff'
  },
  insertHeaderContainer: {
    zIndex: -2,
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff'
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
  },

  submitButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
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

export default Home
