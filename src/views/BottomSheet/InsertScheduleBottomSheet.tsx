import React from 'react'
import {StyleSheet, View, Text, Pressable, TextInput} from 'react-native'

import DatePickerBottomSheet from '@/views/BottomSheet/DatePickerBottomSheet'
import BottomSheet from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

import {useRecoilState} from 'recoil'
import {scheduleState, timeFlagState} from '@/store/schedule'

import {getTimeOfMinute} from '@/utils/helper'

import {RANGE_FLAG} from '@/components/DatePicker/utils/code'
import {RangeFlag} from '@/components/DatePicker/type'

import TimeIcon from '@/assets/icons/time.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'

const InsertScheduleBottomSheet = () => {
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

  const expandBottmSheet = () => {
    if (bottomSheetRef?.current) {
      bottomSheetRef.current.expand()
    }
  }

  const openDatePickerBottomSheet = (flag: RangeFlag) => {
    setRangeFlag(flag)
    setDatePickerBottomSheet(true)
  }

  const changeTitle = (e: string) => {
    setSchedule(prevState => ({...prevState, title: e}))
  }

  const changeDate = (data: string[]) => {
    setSchedule(prevState => ({...prevState, start_date: data[0], end_date: data[1]}))
  }

  const changeMemo = (e: string) => {
    setSchedule(prevState => ({...prevState, memo: e}))
  }

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints} handleComponent={BottomSheetShadowHandler}>
      <View style={styles.container}>
        <View style={{gap: 30}}>
          {/* 시간 */}
          <View style={styles.timeContainer}>
            <Pressable style={styles.timeWrapper} onPress={() => setTimeFlag('START')}>
              <TimeIcon
                width={30}
                fill={'#1E90FF'}
                // fill={timeFlag === 'START' ? '#1E90FF' : '#BABABA'}
              />
              <Text style={styles.timeText}>{`${startTime.hour} : ${startTime.minute}`}</Text>
            </Pressable>
            <Text>-</Text>
            <Pressable style={styles.timeWrapper} onPress={() => setTimeFlag('END')}>
              <TimeIcon
                width={30}
                fill={'#1E90FF'}
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

          {/* 시작일 */}
          <View>
            <Text style={styles.label}>일정</Text>

            <View style={styles.dateContainer}>
              <Pressable style={styles.dateWrapper} onPress={() => openDatePickerBottomSheet(RANGE_FLAG.START)}>
                <CalendarIcon fill={'#1E90FF'} style={{marginRight: 10}} />
                <Text style={styles.dateText}>{schedule.start_date}</Text>
              </Pressable>

              <Text>-</Text>

              <Pressable style={styles.dateWrapper} onPress={() => openDatePickerBottomSheet(RANGE_FLAG.END)}>
                <Text style={styles.dateText}>{schedule.end_date === '9999-12-31' ? '없음' : schedule.end_date}</Text>
              </Pressable>
            </View>
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

        <Pressable style={styles.submitBtn}>
          <Text style={styles.submitText}>등록하기</Text>
        </Pressable>
      </View>

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
