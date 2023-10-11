import React from 'react'
import {StyleSheet, View, Text, Pressable, TextInput} from 'react-native'

import DatePickerBottomSheet from '@/views/BottomSheet/DatePickerBottomSheet'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

import {useRecoilValue, useRecoilState} from 'recoil'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {scheduleDateState, scheduleState, timeFlagState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'
import {format} from 'date-fns'

import {RANGE_FLAG} from '@/components/DatePicker/utils/code'
import {RangeFlag} from '@/components/DatePicker/type'

import TimeIcon from '@/assets/icons/time.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'

import {Schedule} from '@/types/schedule'
import {DAY_OF_WEEK} from '@/types/common'

interface Props {
  data: Schedule[]
  onSubmit: Function
}
const InsertScheduleBottomSheet = ({data: scheduleList, onSubmit}: Props) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const activeTimeTableCategory = useRecoilValue(activeTimeTableCategoryState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [timeFlag, setTimeFlag] = useRecoilState(timeFlagState)

  const [rangeFlag, setRangeFlag] = React.useState<RangeFlag>(RANGE_FLAG.START)
  const [showDatePickerBottomSheet, setDatePickerBottomSheet] = React.useState(false)

  const bottomSheetRef = React.useRef<BottomSheet>(null)

  const snapPoints = React.useMemo(() => ['35%', '95%'], [])

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.start_time)
  }, [schedule.start_time])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.end_time)
  }, [schedule.end_time])

  React.useEffect(() => {
    if (activeTimeTableCategory.timetable_category_id) {
      setSchedule(prevState => ({...prevState, timetable_category_id: activeTimeTableCategory.timetable_category_id}))
    }
  }, [activeTimeTableCategory.timetable_category_id, setSchedule])

  React.useEffect(() => {
    const date = format(scheduleDate, 'yyyy-MM-dd')
    setSchedule(prevState => ({...prevState, start_date: date}))
  }, [scheduleDate, setSchedule])

  const changeTitle = (e: string) => {
    setSchedule(prevState => ({...prevState, title: e}))
  }

  const changeDate = (data: string[]) => {
    setSchedule(prevState => ({
      ...prevState,
      start_date: data[0],
      end_date: data[1]
    }))
  }

  const changeMemo = (e: string) => {
    setSchedule(prevState => ({...prevState, memo: e}))
  }

  const changeDayOfWeek = (key: DAY_OF_WEEK) => {
    const flag = schedule[key] === '1' ? '0' : '1'

    setSchedule(prevState => ({...prevState, [key]: flag}))
  }

  const expandBottmSheet = () => {
    if (bottomSheetRef?.current) {
      bottomSheetRef.current.expand()
    }
  }

  const openDatePickerBottomSheet = (flag: RangeFlag) => {
    setRangeFlag(flag)
    setDatePickerBottomSheet(true)
  }

  const handleSubmit = () => {
    const param = {
      insertSchedue: schedule,
      disableScheduleIdList: getDisableScheduleIdList()
    }

    onSubmit(param)
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
        if (item.schedule_id) {
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
              <Pressable style={styles.timeWrapper} onPress={() => setTimeFlag('START')}>
                <TimeIcon
                  width={30}
                  fill={'#BABABA'}
                  // fill={timeFlag === 'START' ? '#1E90FF' : '#BABABA'}
                />
                <Text style={styles.timeText}>{`${startTime.hour} : ${startTime.minute}`}</Text>
              </Pressable>
              <Text>-</Text>
              <Pressable style={styles.timeWrapper} onPress={() => setTimeFlag('END')}>
                <TimeIcon
                  width={30}
                  fill={'#BABABA'}
                  // fill={timeFlag === 'END' ? '#1E90FF' : '#BABABA'}
                />
                <Text style={styles.timeText}>{`${endTime.hour} : ${endTime.minute}`}</Text>
              </Pressable>
            </View>

            {/* 제목 */}
            <View>
              <Text style={styles.label}>일정명</Text>

              <TextInput
                style={styles.input}
                value={schedule.title}
                onChangeText={changeTitle}
                placeholder={'일정명을 입력해주세요.'}
                onPressIn={expandBottmSheet}
                placeholderTextColor={'#c3c5cc'}
              />
            </View>

            {/* 기간 */}
            <View>
              <Text style={styles.label}>기간</Text>

              <View style={styles.dateContainer}>
                <Pressable style={styles.dateWrapper} onPress={() => openDatePickerBottomSheet(RANGE_FLAG.START)}>
                  <CalendarIcon fill={'#BABABA'} style={{marginRight: 10}} />
                  <Text style={styles.dateText}>{schedule.start_date}</Text>
                </Pressable>

                <Text>-</Text>

                <Pressable style={styles.dateWrapper} onPress={() => openDatePickerBottomSheet(RANGE_FLAG.END)}>
                  <CalendarIcon fill={'#BABABA'} style={{marginRight: 10}} />
                  <Text style={styles.dateText}>{schedule.end_date === '9999-12-31' ? '없음' : schedule.end_date}</Text>
                </Pressable>
              </View>
            </View>

            {/* 요일 */}
            <View>
              <Text style={styles.label}>요일</Text>
              <View style={styles.dayOfWeekContainer}>
                <Pressable
                  style={[styles.dayOfWeek, schedule.mon === '1' && styles.activeDayOfWeek]}
                  onPress={() => changeDayOfWeek('mon')}>
                  <Text style={schedule.mon === '1' && styles.activeDayOfWeekText}>월</Text>
                </Pressable>
                <Pressable
                  style={[styles.dayOfWeek, schedule.tue === '1' && styles.activeDayOfWeek]}
                  onPress={() => changeDayOfWeek('tue')}>
                  <Text style={schedule.tue === '1' && styles.activeDayOfWeekText}>화</Text>
                </Pressable>
                <Pressable
                  style={[styles.dayOfWeek, schedule.wed === '1' && styles.activeDayOfWeek]}
                  onPress={() => changeDayOfWeek('wed')}>
                  <Text style={schedule.wed === '1' && styles.activeDayOfWeekText}>수</Text>
                </Pressable>
                <Pressable
                  style={[styles.dayOfWeek, schedule.thu === '1' && styles.activeDayOfWeek]}
                  onPress={() => changeDayOfWeek('thu')}>
                  <Text style={schedule.thu === '1' && styles.activeDayOfWeekText}>목</Text>
                </Pressable>
                <Pressable
                  style={[styles.dayOfWeek, schedule.fri === '1' && styles.activeDayOfWeek]}
                  onPress={() => changeDayOfWeek('fri')}>
                  <Text style={schedule.fri === '1' && styles.activeDayOfWeekText}>금</Text>
                </Pressable>
                <Pressable
                  style={[styles.dayOfWeek, schedule.sat === '1' && styles.activeDayOfWeek]}
                  onPress={() => changeDayOfWeek('sat')}>
                  <Text style={schedule.sat === '1' && styles.activeDayOfWeekText}>토</Text>
                </Pressable>
                <Pressable
                  style={[styles.dayOfWeek, schedule.sun === '1' && styles.activeDayOfWeek]}
                  onPress={() => changeDayOfWeek('sun')}>
                  <Text style={schedule.sun === '1' && styles.activeDayOfWeekText}>일</Text>
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
            <Text style={styles.submitText}>등록하기</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>

      <DatePickerBottomSheet
        value={[schedule.start_date, schedule.end_date]}
        range
        rangeFlag={rangeFlag}
        isShow={showDatePickerBottomSheet}
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
    fontSize: 16,
    marginBottom: 16,
    color: '#4a495d',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 2,
    borderColor: '#e4e4ec',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 48,
    color: '#555',
    fontSize: 16
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
  timeText: {
    fontSize: 18,
    color: '#7c8698',
    fontWeight: 'bold'
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayOfWeek: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f6f8'
  },
  activeDayOfWeek: {
    backgroundColor: '#1E90FF'
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
})

export default InsertScheduleBottomSheet
