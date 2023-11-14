import React from 'react'
import {useWindowDimensions, StyleSheet, View, Text, Pressable, TextInput} from 'react-native'

import TimePickerBottomSheet from '@/views/BottomSheet/TimePickerBottomSheet'
import DatePickerBottomSheet from '@/views/BottomSheet/DatePickerBottomSheet'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

import {useRecoilValue, useRecoilState, useSetRecoilState} from 'recoil'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {
  scheduleDateState,
  scheduleState,
  activeStartTimeControllerState,
  activeEndTimeControllerState
} from '@/store/schedule'

import TimeIcon from '@/assets/icons/time.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'

import {useMutation} from '@tanstack/react-query'
import * as API from '@/apis/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import {format} from 'date-fns'

import {RANGE_FLAG} from '@/utils/types'
import {Schedule} from '@/types/schedule'
import {DAY_OF_WEEK} from '@/types/common'

interface Props {
  scheduleList: Schedule[]
  refetchScheduleList: Function
  setIsEdit: Function
  titleInputRef: React.RefObject<TextInput>
}
const EditScheduleBottomSheet = ({scheduleList, refetchScheduleList, setIsEdit, titleInputRef}: Props) => {
  const {width} = useWindowDimensions()
  const dayOfWeekSize = width * 0.096
  const scheduleDate = useRecoilValue(scheduleDateState)
  const activeTimeTableCategory = useRecoilValue(activeTimeTableCategoryState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const setActiveStartTimeController = useSetRecoilState(activeStartTimeControllerState)
  const setActiveEndTimeController = useSetRecoilState(activeEndTimeControllerState)

  const [timeRangeFlag, setTimeRangeFlag] = React.useState<RANGE_FLAG>(RANGE_FLAG.START)
  const [dateRangeFlag, setDateRangeFlag] = React.useState<RANGE_FLAG>(RANGE_FLAG.START)
  const [showTimePickerBototmSheet, setTimePickerBottomSheet] = React.useState(false)
  const [showDatePickerBottomSheet, setDatePickerBottomSheet] = React.useState(false)

  const bottomSheetRef = React.useRef<BottomSheet>(null)

  const snapPoints = React.useMemo(() => ['35%', '93%'], [])

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.start_time)
  }, [schedule.start_time])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.end_time)
  }, [schedule.end_time])

  const title = React.useMemo(() => {
    return String(schedule.title).replace(/\n/g, ' ')
  }, [schedule.title])

  React.useEffect(() => {
    if (activeTimeTableCategory.timetable_category_id) {
      setSchedule(prevState => ({...prevState, timetable_category_id: activeTimeTableCategory.timetable_category_id}))
    }
  }, [activeTimeTableCategory.timetable_category_id, setSchedule])

  React.useEffect(() => {
    const date = format(scheduleDate, 'yyyy-MM-dd')
    setSchedule(prevState => ({...prevState, ...{start_date: date}}))
  }, [scheduleDate, setSchedule])

  const setScheduleMutation = useMutation({
    mutationFn: async (params: API.SetScheduleParam) => {
      return await API.setSchedule(params)
    },
    onSuccess: async () => {
      await refetchScheduleList()
      setIsEdit(false)
    }
  })

  const onFocusTitleInput = () => {
    if (titleInputRef && titleInputRef.current && bottomSheetRef && bottomSheetRef.current) {
      bottomSheetRef.current?.collapse()
      titleInputRef.current.focus()
    }
  }

  const changeTime = (time: number) => {
    if (timeRangeFlag === RANGE_FLAG.START) {
      setSchedule(prevState => ({
        ...prevState,
        start_time: time
      }))
    } else if (timeRangeFlag === RANGE_FLAG.END) {
      setSchedule(prevState => ({
        ...prevState,
        end_time: time
      }))
    }
  }

  const changeDate = (date: string[]) => {
    setSchedule(prevState => ({
      ...prevState,
      start_date: date[0],
      end_date: date[1]
    }))
  }

  const changeMemo = (e: string) => {
    setSchedule(prevState => ({...prevState, memo: e}))
  }

  const changeDayOfWeek = (key: DAY_OF_WEEK) => {
    const flag = schedule[key] === '1' ? '0' : '1'

    setSchedule(prevState => ({...prevState, [key]: flag}))
  }

  const openTimePickerBottomSheet = (flag: RANGE_FLAG) => {
    if (flag === RANGE_FLAG.START) {
      setActiveStartTimeController(true)
      setActiveEndTimeController(false)
    } else if (flag === RANGE_FLAG.END) {
      setActiveStartTimeController(false)
      setActiveEndTimeController(true)
    }

    setTimeRangeFlag(flag)
    setTimePickerBottomSheet(true)
  }

  const openDatePickerBottomSheet = (flag: RANGE_FLAG) => {
    setDateRangeFlag(flag)
    setDatePickerBottomSheet(true)
  }

  const handleSubmit = () => {
    const params = {
      schedule,
      disableScheduleIdList: getDisableScheduleIdList()
    }

    setScheduleMutation.mutate(params)
  }

  const getDisableScheduleIdList = () => {
    const {start_time, end_time} = schedule

    const disableScheduleIdList: number[] = []

    scheduleList.forEach(item => {
      const isOverlapAll =
        item.start_time >= start_time &&
        item.start_time < end_time &&
        item.end_time <= end_time &&
        item.end_time > start_time

      const isOverlapLeft = item.start_time >= start_time && item.end_time > end_time && item.start_time < end_time

      const isOverlapRight = item.start_time < start_time && item.end_time <= end_time && item.end_time > start_time

      const isOverlapCenter =
        item.start_time < start_time &&
        item.end_time > end_time &&
        item.start_time < end_time &&
        item.end_time > start_time

      if (isOverlapAll || isOverlapLeft || isOverlapRight || isOverlapCenter) {
        if (item.schedule_id && item.schedule_id !== schedule.schedule_id) {
          disableScheduleIdList.push(item.schedule_id)
        }
      }
    })

    return disableScheduleIdList
  }

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints} handleComponent={BottomSheetShadowHandler}>
      <BottomSheetScrollView>
        <View style={styles.container}>
          <View style={{gap: 30}}>
            {/* 시간 */}
            <View style={styles.timeContainer}>
              <Pressable style={styles.timeWrapper} onPress={() => openTimePickerBottomSheet(RANGE_FLAG.START)}>
                <TimeIcon width={30} fill={'#BABABA'} />
                <View>
                  <Text style={styles.meridiemText}>{startTime.meridiem}</Text>
                  <Text style={styles.timeText}>{`${startTime.hour}시 ${startTime.minute}분`}</Text>
                </View>
              </Pressable>
              <Text style={styles.dash}>-</Text>
              <Pressable style={styles.timeWrapper} onPress={() => openTimePickerBottomSheet(RANGE_FLAG.END)}>
                <TimeIcon width={30} fill={'#BABABA'} />
                <View>
                  <Text style={styles.meridiemText}>{endTime.meridiem}</Text>
                  <Text style={styles.timeText}>{`${endTime.hour}시 ${endTime.minute}분`}</Text>
                </View>
              </Pressable>
            </View>

            {/* 제목 */}
            <View>
              <Text style={styles.label}>일정명</Text>

              <Pressable style={styles.input} onPress={onFocusTitleInput}>
                <Text style={[styles.inputText, !schedule.title && {color: '#c3c5cc'}]} numberOfLines={1}>
                  {schedule.title ? title : '일정명을 입력해주세요.'}
                </Text>
              </Pressable>
            </View>

            {/* 기간 */}
            <View>
              <Text style={styles.label}>기간</Text>

              <View style={styles.dateContainer}>
                <Pressable style={styles.dateWrapper} onPress={() => openDatePickerBottomSheet(RANGE_FLAG.START)}>
                  <CalendarIcon stroke="#BABABA" style={{marginRight: 10}} />
                  <Text style={styles.dateText}>{schedule.start_date}</Text>
                </Pressable>

                <Text style={styles.dash}>-</Text>

                <Pressable style={styles.dateWrapper} onPress={() => openDatePickerBottomSheet(RANGE_FLAG.END)}>
                  <CalendarIcon stroke="#BABABA" style={{marginRight: 10}} />
                  <Text style={styles.dateText}>{schedule.end_date === '9999-12-31' ? '없음' : schedule.end_date}</Text>
                </Pressable>
              </View>
            </View>

            {/* 요일 */}
            <View>
              <Text style={styles.label}>요일</Text>
              <View style={styles.dayOfWeekContainer}>
                <Pressable
                  style={[
                    styles.dayOfWeek,
                    schedule.mon === '1' && styles.activeDayOfWeek,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => changeDayOfWeek('mon')}>
                  <Text style={[styles.dayofWeekText, schedule.mon === '1' && styles.activeDayOfWeekText]}>월</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.dayOfWeek,
                    schedule.tue === '1' && styles.activeDayOfWeek,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => changeDayOfWeek('tue')}>
                  <Text style={[styles.dayofWeekText, schedule.tue === '1' && styles.activeDayOfWeekText]}>화</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.dayOfWeek,
                    schedule.wed === '1' && styles.activeDayOfWeek,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => changeDayOfWeek('wed')}>
                  <Text style={[styles.dayofWeekText, schedule.wed === '1' && styles.activeDayOfWeekText]}>수</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.dayOfWeek,
                    schedule.thu === '1' && styles.activeDayOfWeek,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => changeDayOfWeek('thu')}>
                  <Text style={[styles.dayofWeekText, schedule.thu === '1' && styles.activeDayOfWeekText]}>목</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.dayOfWeek,
                    schedule.fri === '1' && styles.activeDayOfWeek,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => changeDayOfWeek('fri')}>
                  <Text style={[styles.dayofWeekText, schedule.fri === '1' && styles.activeDayOfWeekText]}>금</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.dayOfWeek,
                    schedule.sat === '1' && styles.activeDayOfWeek,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => changeDayOfWeek('sat')}>
                  <Text style={[styles.dayofWeekText, schedule.sat === '1' && styles.activeDayOfWeekText]}>토</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.dayOfWeek,
                    schedule.sun === '1' && styles.activeDayOfWeek,
                    {width: dayOfWeekSize, height: dayOfWeekSize, borderRadius: dayOfWeekSize / 2}
                  ]}
                  onPress={() => changeDayOfWeek('sun')}>
                  <Text style={[styles.dayofWeekText, schedule.sun === '1' && styles.activeDayOfWeekText]}>일</Text>
                </Pressable>
              </View>
              <View />
            </View>

            {/* 메모 */}
            <View>
              <Text style={styles.label}>메모</Text>

              <TextInput
                style={[styles.input, {height: 96}]}
                value={schedule.memo}
                onChangeText={changeMemo}
                multiline={true}
                placeholderTextColor={'#c3c5cc'}
              />
            </View>
          </View>

          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>{schedule.schedule_id ? '수정하기' : '등록하기'}</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>

      <TimePickerBottomSheet
        value={[schedule.start_time, schedule.end_time]}
        isShow={showTimePickerBototmSheet}
        rangeFlag={timeRangeFlag}
        onClose={() => setTimePickerBottomSheet(false)}
        onChange={changeTime}
      />
      <DatePickerBottomSheet
        value={[schedule.start_date, schedule.end_date]}
        range
        isShow={showDatePickerBottomSheet}
        rangeFlag={dateRangeFlag}
        onChangeRangeFlag={setDateRangeFlag}
        onClose={() => setDatePickerBottomSheet(false)}
        onChange={changeDate}
      />
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    flex: 1,
    justifyContent: 'space-between'
  },
  label: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    marginBottom: 16,
    color: '#000',
    fontWeight: 'bold'
  },
  input: {
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e4e4ec',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 14
  },
  inputText: {
    fontFamily: 'GmarketSansTTFMedium',
    color: '#555',
    fontSize: 16
  },
  dash: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    color: '#7c8698'
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  timeWrapper: {
    flex: 1,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f5f6f8'
  },
  meridiemText: {
    fontFamily: 'GmarketSansTTFMedium',
    color: '#7c8698',
    fontSize: 12,
    marginBottom: 5
  },
  timeText: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 16,
    color: '#7c8698'
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayOfWeek: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8'
  },
  activeDayOfWeek: {
    backgroundColor: '#1E90FF'
  },
  dayofWeekText: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 14,
    color: '#7c8698'
  },
  activeDayOfWeekText: {
    color: '#fff'
  },
  dateContainer: {
    height: 52,
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 10,
    paddingHorizontal: 10
  },
  dateWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateText: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 16,
    color: '#7c8698'
  },
  submitBtn: {
    height: 48,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#2d8cec'
  },
  submitText: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default EditScheduleBottomSheet
