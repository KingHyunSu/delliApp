import React from 'react'
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native'

import AppBar from '@/components/AppBar'
import TimeTable from '@/components/TimeTable'
import WeeklyDatePicker from '@/components/WeeklyDatePicker'
import InsertScheduleBottomSheet from '@/views/BottomSheet/InsertScheduleBottomSheet'
import LoginBottomSheet from '@/views/BottomSheet/LoginBottomSheet'
import ScheduleListBottomSheet from '@/views/BottomSheet/ScheduleListBottomSheet'
import TimeTableCategotyBottomSheet from '@/views/BottomSheet/TimeTableCategotyBottomSheet'

import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import SettingIcon from '@/assets/icons/setting.svg'

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

  const [isInsertMode, changeInsertMode] = React.useState(false)
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
      changeInsertMode(false)
    }
  })

  const updateScheduleCompleteMutation = useMutation({
    mutationFn: async (data: Schedule) => {
      return await updateScheduleComplete(data)
    }
  })

  const handleSubmit = async (data: SetScheduleParam) => {
    setScheduleMutation.mutate(data)
  }

  const updateComplete = (data: Schedule) => {
    updateScheduleCompleteMutation.mutate(data)
  }

  const handleLoginBottomSheetChanges = async () => {
    await refetchTimetableCategoryList()
    await refetchScheduleList()

    changeInsertMode(false)
    setShowLoginBottomSheet(false)
  }

  const handleInsertScheduleBottomSheetClose = () => {
    const list = scheduleList.map(item => {
      return {...item, screenDisable: false}
    })

    setScheduleList(list)

    changeInsertMode(false)
  }

  const showInsertBottomSheet = () => {
    if (!isLogin) {
      setShowLoginBottomSheet(true)
    } else {
      changeInsertMode(true)
    }
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
    if (isInsertMode) {
      translateAnimation(headerTranslateY, -200, 350)
      translateAnimation(timaTableTranslateY, -100)
    } else {
      resetScheduleEdit()

      translateAnimation(headerTranslateY, 0, 350)
      translateAnimation(timaTableTranslateY, 0)
    }
  }, [isLogin, isInsertMode, headerTranslateY, timaTableTranslateY, resetScheduleEdit])

  return (
    <View style={homeStyles.container}>
      <Animated.View style={{transform: [{translateY: headerTranslateY}]}}>
        <AppBar>
          <Pressable
            style={homeStyles.timetableCategoryButton}
            onPress={() => setShowTimeTableCategoryBottomSheet(true)}>
            <Text style={homeStyles.timetableCategoryText} numberOfLines={1}>
              {activeTimeTableCategory.title}
            </Text>
            <ArrowDownIcon stroke="#000" />
          </Pressable>

          <SettingIcon stroke="#242933" />
        </AppBar>

        <View style={homeStyles.weekDatePickerSection}>
          <WeeklyDatePicker />
        </View>
      </Animated.View>

      <Animated.View style={[{transform: [{translateY: timaTableTranslateY}]}]}>
        <Pressable onPress={handleInsertScheduleBottomSheetClose}>
          <TimeTable data={scheduleList} isInsertMode={isInsertMode && isLogin} onClick={showInsertBottomSheet} />
        </Pressable>
      </Animated.View>

      {isInsertMode ? (
        <InsertScheduleBottomSheet data={scheduleList} onSubmit={handleSubmit} />
      ) : (
        <ScheduleListBottomSheet data={scheduleList} onComplete={updateComplete} />
      )}
      {!isLogin && <LoginBottomSheet isShow={isShowLoginBottomSheet} onClose={handleLoginBottomSheetChanges} />}
      <TimeTableCategotyBottomSheet
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
