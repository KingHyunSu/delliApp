import React from 'react'
import {Platform, Animated, Pressable, StyleSheet, View, TextInput, LayoutChangeEvent} from 'react-native'

import Loading from '@/components/Loading'
import AppBar from '@/components/AppBar'
import TimeTable from '@/components/TimeTable'
import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import EditMenuBottomSheet from '@/views/BottomSheet/EditMenuBottomSheet'
import EditScheduleBottomSheet from '@/views/BottomSheet/EditScheduleBottomSheet2'
import ScheduleListBottomSheet from '@/views/BottomSheet/ScheduleListBottomSheet2'
// import ScheduleListBottomSheet from '@/views/BottomSheet/ScheduleListBottomSheet'
import TimetableCategoryBottomSheet from '@/views/BottomSheet/TimetableCategoryBottomSheet'
import StyleBottomSheet from '@/views/BottomSheet/StyleBottomSheet'
import ColorPickerBottomSheet from '@/views/BottomSheet/ColorPickerBottomSheet'
import EditTodoModal from '@/views/Modal/EditTodoModal'
// import ScheduleCompleteModal from '@/views/Modal/ScheduleCompleteModal'

import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import SettingIcon from '@/assets/icons/setting.svg'
import CancleIcon from '@/assets/icons/cancle.svg'
import EditIcon from '@/assets/icons/edit3.svg'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {isEditState, isLoadingState, homeHeaderHeightState} from '@/store/system'
import {
  scheduleDateState,
  scheduleState,
  scheduleListState,
  editStartAngleState,
  editEndAngleState
} from '@/store/schedule'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {showColorPickerBottomSheetState, showEditMenuBottomSheetState} from '@/store/bottomSheet'

import {getScheduleList} from '@/apis/schedule'
import {getTimetableCategoryList} from '@/apis/timetable'
import {useQuery} from '@tanstack/react-query'

import {getDayOfWeekKey} from '@/utils/helper'
import {format} from 'date-fns'

import {HomeNavigationProps} from '@/types/navigation'

const Home = ({navigation}: HomeNavigationProps) => {
  const titleInputRef = React.useRef<TextInput>(null)
  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const [activeTimeTableCategory, setActiveTimeTableCategory] = useRecoilState(activeTimeTableCategoryState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)

  const isShowColorPickerBottomSheetState = useRecoilValue(showColorPickerBottomSheetState)
  const setHomeHeaderHeight = useSetRecoilState(homeHeaderHeightState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)
  const setSchedule = useSetRecoilState(scheduleState)
  const setEditStartAngle = useSetRecoilState(editStartAngleState)
  const setEditEndAngle = useSetRecoilState(editEndAngleState)
  const resetSchedule = useResetRecoilState(scheduleState)

  useQuery({
    queryKey: ['timetableCategoryList'],
    queryFn: async () => {
      const response = await getTimetableCategoryList()
      const result = response.data

      if (result.length > 0) {
        setActiveTimeTableCategory(result[0])
      }

      return result
    }
  })

  const {refetch: refetchScheduleList, isError} = useQuery({
    queryKey: ['scheduleList', scheduleDate],
    queryFn: async () => {
      setIsLoading(true)
      if (activeTimeTableCategory.timetable_category_id) {
        const date = format(scheduleDate, 'yyyy-MM-dd')

        const param = {
          timetable_category_id: activeTimeTableCategory.timetable_category_id,
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
        const dayOfWeek = getDayOfWeekKey(scheduleDate.getDay())

        if (dayOfWeek) {
          param[dayOfWeek] = '1'
        }

        const response = await getScheduleList(param)
        setScheduleList(response.data)

        setTimeout(() => {
          setIsLoading(false)
        }, 300)

        return response.data
      }

      return []
    },
    initialData: [],
    enabled: !!activeTimeTableCategory.timetable_category_id
  })

  const openEditScheduleBottomSheet = (value?: Schedule) => {
    if (value) {
      setSchedule(value)
    }

    setIsEdit(true)
  }

  const openEditMenuBottomSheet = (value: Schedule) => {
    setEditStartAngle(value.start_time * 0.25)
    setEditEndAngle(value.end_time * 0.25)
    setSchedule(value)
    setShowEditMenuBottomSheet(true)
  }

  const closeEditScheduleBottomSheet = () => {
    const list = scheduleList.map(item => {
      return {...item, disable: '0'}
    })

    setScheduleList(list)
    setIsEdit(false)
  }

  const handleTopLayout = (layout: LayoutChangeEvent) => {
    setHomeHeaderHeight(layout.nativeEvent.layout.height)
  }

  const headerTranslateY = React.useRef(new Animated.Value(0)).current
  const timaTableTranslateY = React.useRef(new Animated.Value(0)).current

  const translateAnimation = (target: Animated.Value, to: number, duration?: number) => {
    Animated.timing(target, {
      toValue: to,
      duration: duration ? duration : 300,
      useNativeDriver: true
    }).start()
  }

  const resetEditForm = () => {
    resetSchedule()
    setEditStartAngle(0)
    setEditEndAngle(90)
  }

  React.useEffect(() => {
    if (isEdit) {
      translateAnimation(headerTranslateY, -200, 350)
      translateAnimation(timaTableTranslateY, -100)
    } else {
      resetEditForm()
      translateAnimation(headerTranslateY, 0, 350)
      translateAnimation(timaTableTranslateY, 0)
    }
  }, [isEdit, headerTranslateY, timaTableTranslateY])

  React.useEffect(() => {
    if (isError) {
      setIsLoading(false)
    }
  }, [isError])

  return (
    <View style={homeStyles.container}>
      {/* insert header */}
      <View style={homeStyles.insertHeaderContainer}>
        <AppBar>
          {/* [TODO] 2023-10-28 카테고리 기능 보완하여 오픈 */}
          {/* <Text style={homeStyles.timetableCategoryText}>{activeTimeTableCategory.title}</Text> */}
          <View />

          {!isShowColorPickerBottomSheetState && (
            <Pressable style={homeStyles.appBarRightButton} onPress={closeEditScheduleBottomSheet}>
              <CancleIcon stroke="#242933" />
            </Pressable>
          )}
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
        <TimeTable
          data={scheduleList}
          isEdit={isEdit}
          titleInputRef={titleInputRef}
          onClick={openEditMenuBottomSheet}
        />
      </Animated.View>

      {isEdit ? (
        <EditScheduleBottomSheet
          scheduleList={scheduleList}
          refetchScheduleList={refetchScheduleList}
          setIsEdit={setIsEdit}
          titleInputRef={titleInputRef}
        />
      ) : (
        <ScheduleListBottomSheet
          data={scheduleList}
          openEditScheduleBottomSheet={openEditScheduleBottomSheet}
          onClick={openEditMenuBottomSheet}
        />
      )}

      {!isEdit && (
        <Pressable style={homeStyles.fabContainer} onPress={() => openEditScheduleBottomSheet()}>
          <EditIcon stroke="#fff" width={18} height={18} />
        </Pressable>
      )}

      {/* bottom sheet */}
      <EditMenuBottomSheet refetchScheduleList={refetchScheduleList} />
      <TimetableCategoryBottomSheet />
      <StyleBottomSheet />
      <ColorPickerBottomSheet />

      {/* modal */}
      {/* <ScheduleCompleteModal /> */}
      <EditTodoModal refetchScheduleList={refetchScheduleList} />

      <Loading />
    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
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
  }
})

export default Home
