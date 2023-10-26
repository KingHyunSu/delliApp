import React from 'react'
import {Animated, Pressable, StyleSheet, Text, View, LayoutChangeEvent} from 'react-native'

import AppBar from '@/components/AppBar'
import TimeTable from '@/components/TimeTable'
import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import EditScheduleBottomSheet from '@/views/BottomSheet/EditScheduleBottomSheet'
import LoginBottomSheet from '@/views/BottomSheet/LoginBottomSheet'
import ScheduleListBottomSheet from '@/views/BottomSheet/ScheduleListBottomSheet'
import TimetableCategotyBottomSheet from '@/views/BottomSheet/TimetableCategoryBottomSheet'

import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import SettingIcon from '@/assets/icons/setting.svg'
import CancleIcon from '@/assets/icons/cancle.svg'

import {scheduleDateState, scheduleListState, scheduleState} from '@/store/schedule'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {isLoginState} from '@/store/user'
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil'

import {getScheduleList, setSchedule, updateScheduleComplete, SetScheduleParam} from '@/apis/schedule'
import {getTimetableCategoryList} from '@/apis/timetable'
import {useMutation, useQuery} from '@tanstack/react-query'

import {getDayOfWeekKey} from '@/utils/helper'
import {format} from 'date-fns'

import {Schedule} from '@/types/schedule'

const Home = () => {
  const isLogin = useRecoilValue(isLoginState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const [activeTimeTableCategory, setActiveTimeTableCategory] = useRecoilState(activeTimeTableCategoryState)
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const resetScheduleEdit = useResetRecoilState(scheduleState)

  const [schedule_id, setSchedule_id] = React.useState<number | null>(null)
  const [homeTopHeight, setHomeTopHeight] = React.useState(0)
  const [isEdit, setIsEdit] = React.useState(false)
  const [isShowTimeTableCategoryBottomSheet, setShowTimeTableCategoryBottomSheet] = React.useState(false)
  const [isShowLoginBottomSheet, setShowLoginBottomSheet] = React.useState(false)

  const {refetch: refetchTimetableCategoryList} = useQuery({
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

  const {
    isLoading,
    isError,
    error,
    refetch: refetchScheduleList
  } = useQuery({
    queryKey: ['scheduleList', scheduleDate],
    queryFn: async () => {
      if (activeTimeTableCategory.timetable_category_id) {
        const date = format(scheduleDate, 'yyyy-MM-dd')

        const param = {
          date,
          mon: '',
          tue: '',
          wed: '',
          thu: '',
          fri: '',
          sat: '',
          sun: '',
          timetable_category_id: activeTimeTableCategory.timetable_category_id
        }
        const dayOfWeek = getDayOfWeekKey(scheduleDate.getDay())

        if (dayOfWeek) {
          param[dayOfWeek] = '1'
        }

        const response = await getScheduleList(param)
        const result = response.data.map(item => {
          return {...item, screenDisable: false}
        })

        setScheduleList(result)

        return result
      }

      return []
    },
    initialData: [],
    enabled: !!activeTimeTableCategory.timetable_category_id
  })

  const setScheduleMutation = useMutation({
    mutationFn: async (data: SetScheduleParam) => {
      return await setSchedule(data)
    },
    onSuccess: async () => {
      await refetchScheduleList()
      setIsEdit(false)
    }
  })

  const updateScheduleCompleteMutation = useMutation({
    mutationFn: async (data: Schedule) => {
      return await updateScheduleComplete(data)
    }
  })

  const handleDetail = (data: Schedule) => {
    setSchedule_id(data.schedule_id)
    setIsEdit(true)
  }

  const handleSubmit = (data: SetScheduleParam) => {
    setScheduleMutation.mutate(data)
  }

  const updateComplete = (data: Schedule) => {
    updateScheduleCompleteMutation.mutate(data)
  }

  const handleLoginBottomSheetChanges = async () => {
    await refetchTimetableCategoryList()
    await refetchScheduleList()

    setIsEdit(false)
    setShowLoginBottomSheet(false)
  }

  const handleInsertScheduleBottomSheetClose = () => {
    const list = scheduleList.map(item => {
      return {...item, screenDisable: false}
    })

    setSchedule_id(null)
    setScheduleList(list)
    setIsEdit(false)
  }

  const showInsertBottomSheet = () => {
    if (!isLogin) {
      setShowLoginBottomSheet(true)
    } else {
      setIsEdit(true)
    }
  }

  const handleTopLayout = (layout: LayoutChangeEvent) => {
    setHomeTopHeight(layout.nativeEvent.layout.height)
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

  React.useEffect(() => {
    if (!isLogin) {
      return
    }
    if (isEdit) {
      translateAnimation(headerTranslateY, -200, 350)
      translateAnimation(timaTableTranslateY, -100)
    } else {
      resetScheduleEdit()

      translateAnimation(headerTranslateY, 0, 350)
      translateAnimation(timaTableTranslateY, 0)
    }
  }, [isLogin, isEdit, headerTranslateY, timaTableTranslateY, resetScheduleEdit])

  React.useEffect(() => {
    setShowLoginBottomSheet(true)
  }, [])

  return (
    <View style={homeStyles.container}>
      {/* insert header */}
      <View style={homeStyles.insertHeaderContainer}>
        <AppBar>
          <Text style={homeStyles.timetableCategoryText}>{activeTimeTableCategory.title}</Text>

          <Pressable style={homeStyles.button} onPress={handleInsertScheduleBottomSheetClose}>
            <CancleIcon stroke="#242933" />
          </Pressable>
        </AppBar>
      </View>

      {/* home header */}
      <Animated.View
        style={[homeStyles.homeHeaderContainer, {transform: [{translateY: headerTranslateY}]}]}
        onLayout={handleTopLayout}>
        <AppBar>
          {isLogin && activeTimeTableCategory.timetable_category_id ? (
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
          )}

          <SettingIcon stroke="#242933" />
        </AppBar>

        <View style={homeStyles.weekDatePickerSection}>
          <WeeklyDatePicker />
        </View>
      </Animated.View>

      <Animated.View style={[{transform: [{translateY: timaTableTranslateY}]}]}>
        <TimeTable
          data={scheduleList}
          homeTopHeight={homeTopHeight}
          isEdit={isEdit && isLogin}
          onClick={showInsertBottomSheet}
        />
      </Animated.View>

      {isEdit ? (
        <EditScheduleBottomSheet data={scheduleList} schedule_id={schedule_id} onSubmit={handleSubmit} />
      ) : (
        <ScheduleListBottomSheet data={scheduleList} onComplete={updateComplete} onClick={handleDetail} />
      )}
      {!isLogin && <LoginBottomSheet isShow={isShowLoginBottomSheet} onClose={handleLoginBottomSheetChanges} />}
      <TimetableCategotyBottomSheet
        isShow={isShowTimeTableCategoryBottomSheet}
        onClose={() => setShowTimeTableCategoryBottomSheet(false)}
      />
    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'flex-end',
    justifyContent: 'center'
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
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 20
  }
})

export default Home
