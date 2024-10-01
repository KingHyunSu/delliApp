import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import RepeatCountSelectorBottomSheet from '@/components/bottomSheet/RepeatCountSelectorBottomSheet'
import type {Count} from '@/components/bottomSheet/RepeatCountSelectorBottomSheet'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import PlusIcon from '@/assets/icons/plus.svg'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {showRepeatCountSelectorBottomSheetState} from '@/store/bottomSheet'
import {searchScheduleResultListState} from '@/store/schedule'
import {bottomSafeAreaColorState} from '@/store/system'

import {SetRoutine} from '@/repository/types/todo'
import {EditRoutineScreenProps} from '@/types/navigation'

const RepeatCompleteType = {DAILY: 1, TWO_DAYS: 2, WEEK: 3} as const
const EditRoutine = ({navigation}: EditRoutineScreenProps) => {
  const isFocused = useIsFocused()

  const [form, setForm] = useState<SetRoutine>({
    routine_id: null,
    title: '',
    repeat_complete_type: 1,
    repeat_complete_count: 1,
    schedule_id: null,
    schedule_title: null,
    schedule_category_id: null,
    schedule_start_time: null,
    schedule_end_time: null,
    schedule_mon: null,
    schedule_tue: null,
    schedule_wed: null,
    schedule_thu: null,
    schedule_fri: null,
    schedule_sat: null,
    schedule_sun: null,
    schedule_start_date: null,
    schedule_end_date: null
  })

  const [searchScheduleResultList, setSearchScheduleResultList] = useRecoilState(searchScheduleResultListState)
  const setShowRepeatCountSelectorBottomSheet = useSetRecoilState(showRepeatCountSelectorBottomSheetState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)

  const disabledChangeRepeatCount = useMemo(() => {
    return form.repeat_complete_type !== RepeatCompleteType.WEEK
  }, [form.repeat_complete_type])

  const getRepeatTypeButtonStyle = useCallback(
    (type: (typeof RepeatCompleteType)[keyof typeof RepeatCompleteType]) => {
      if (type === form.repeat_complete_type) {
        return activeRepeatTypeButtonStyle
      }

      return styles.repeatTypeButton
    },
    [form.repeat_complete_type]
  )

  const getRepeatTypeButtonTextStyle = useCallback(
    (type: (typeof RepeatCompleteType)[keyof typeof RepeatCompleteType]) => {
      if (type === form.repeat_complete_type) {
        return activeRepeatTypeButtonTextStyle
      }

      return styles.repeatTypeButtonText
    },
    [form.repeat_complete_type]
  )

  const repeatCountButtonTextStyle = useMemo(() => {
    if (disabledChangeRepeatCount) {
      return disabledRepeatCountButtonTextStyle
    }

    return styles.repeatCountButtonText
  }, [disabledChangeRepeatCount])

  const activeSubmit = useMemo(() => {
    return !!(form.title && form.schedule_id)
  }, [form.title, form.schedule_id])

  const submitButtonStyle = useMemo(() => {
    return activeSubmit ? activeSubmitButton : styles.submitButton
  }, [activeSubmit])

  const submitButtonTextStyle = useMemo(() => {
    return activeSubmit ? activeSubmitButtonText : styles.submitButtonText
  }, [activeSubmit])

  const getRepeatCountString = useCallback((value: Count) => {
    switch (value) {
      case 1:
        return '한 번'
      case 2:
        return '두 번'
      case 3:
        return '세 번'
      case 4:
        return '네 번'
      case 5:
        return '다섯 번'
      case 6:
        return '여섯 번'
      default:
        return ''
    }
  }, [])

  const changeRepeatType = useCallback(
    (type: (typeof RepeatCompleteType)[keyof typeof RepeatCompleteType]) => () => {
      const repeatCompleteCount = type !== RepeatCompleteType.WEEK ? 1 : form.repeat_complete_count

      setForm(prevState => ({
        ...prevState,
        repeat_complete_type: type,
        repeat_complete_count: repeatCompleteCount
      }))
    },
    [form.repeat_complete_count, setForm]
  )

  const changeRepeatCount = useCallback(
    (value: Count) => {
      setForm(prevState => ({
        ...prevState,
        repeat_complete_count: value
      }))
    },
    [setForm]
  )

  const showRepeatCountSelectorBottomSheet = useCallback(() => {
    setShowRepeatCountSelectorBottomSheet(true)
  }, [setShowRepeatCountSelectorBottomSheet])

  const deleteSchedule = useCallback(() => {
    setSearchScheduleResultList([])
    setForm(prevState => ({
      ...prevState,
      schedule_id: null,
      schedule_title: null,
      schedule_category_id: null,
      schedule_start_time: null,
      schedule_end_time: null,
      schedule_mon: null,
      schedule_tue: null,
      schedule_wed: null,
      schedule_thu: null,
      schedule_fri: null,
      schedule_sat: null,
      schedule_sun: null,
      schedule_start_date: null,
      schedule_end_date: null
    }))
  }, [setSearchScheduleResultList, setForm])

  const handleConfirm = useCallback(() => {}, [])

  useEffect(() => {
    if (searchScheduleResultList.length > 0) {
      const searchScheduleResult = searchScheduleResultList[0]
      if (searchScheduleResult.schedule_id !== form.schedule_id) {
        setForm(prevState => ({
          ...prevState,
          schedule_id: searchScheduleResult.schedule_id,
          schedule_title: searchScheduleResult.title,
          schedule_category_id: searchScheduleResult.schedule_category_id || null,
          schedule_start_time: searchScheduleResult.start_time,
          schedule_end_time: searchScheduleResult.end_time,
          schedule_mon: searchScheduleResult.mon,
          schedule_tue: searchScheduleResult.tue,
          schedule_wed: searchScheduleResult.wed,
          schedule_thu: searchScheduleResult.thu,
          schedule_fri: searchScheduleResult.fri,
          schedule_sat: searchScheduleResult.sat,
          schedule_sun: searchScheduleResult.sun,
          schedule_start_date: searchScheduleResult.start_date,
          schedule_end_date: searchScheduleResult.end_date
        }))
      }
    }
  }, [searchScheduleResultList, form.schedule_id])

  useEffect(() => {
    if (isFocused) {
      if (activeSubmit) {
        setBottomSafeAreaColor('#1E90FF')
      } else {
        setBottomSafeAreaColor('#f5f6f8')
      }
    }
  }, [isFocused, activeSubmit, setBottomSafeAreaColor])

  return (
    <View style={styles.container}>
      <AppBar backPress />
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.topWrapper}>
          {/* 루틴명 */}
          <TextInput
            placeholder="새로운 루틴"
            placeholderTextColor="#c3c5cc"
            autoFocus
            style={styles.input}
            onChangeText={(value: string) => setForm(prevState => ({...prevState, title: value}))}
          />

          <View style={styles.repeatContainer}>
            <Text style={styles.repeatContainerLabel}>반복</Text>

            <View style={styles.repeatTypeWrapper}>
              <Pressable
                style={getRepeatTypeButtonStyle(RepeatCompleteType.DAILY)}
                onPress={changeRepeatType(RepeatCompleteType.DAILY)}>
                <Text style={getRepeatTypeButtonTextStyle(RepeatCompleteType.DAILY)}>매일</Text>
              </Pressable>
              <Pressable
                style={getRepeatTypeButtonStyle(RepeatCompleteType.TWO_DAYS)}
                onPress={changeRepeatType(RepeatCompleteType.TWO_DAYS)}>
                <Text style={getRepeatTypeButtonTextStyle(RepeatCompleteType.TWO_DAYS)}>이틀</Text>
              </Pressable>
              <Pressable
                style={getRepeatTypeButtonStyle(RepeatCompleteType.WEEK)}
                onPress={changeRepeatType(RepeatCompleteType.WEEK)}>
                <Text style={getRepeatTypeButtonTextStyle(RepeatCompleteType.WEEK)}>일주일</Text>
              </Pressable>
            </View>

            <View style={styles.repeatCountWrapper}>
              <Text style={styles.repeatContainerLabel}>횟수</Text>

              <Pressable
                style={styles.repeatCountButton}
                disabled={disabledChangeRepeatCount}
                onPress={showRepeatCountSelectorBottomSheet}>
                <Text style={repeatCountButtonTextStyle}>{getRepeatCountString(form.repeat_complete_count)}</Text>

                <ArrowDownIcon stroke={disabledChangeRepeatCount ? '#c3c5cc' : '#424242'} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.bottomWrapper}>
          <Text style={styles.label}>{form.schedule_id ? '선택된 일정' : '어떤 일정에 루틴을 추가할까요?'}</Text>

          {form.schedule_id ? (
            <View style={styles.scheduleWrapper}>
              <ScheduleItem
                title={form.schedule_title!}
                categoryId={form.schedule_category_id}
                time={{startTime: form.schedule_start_time!, endTime: form.schedule_end_time!}}
                date={{startDate: form.schedule_start_date!, endDate: form.schedule_end_date!}}
                dayOfWeek={{
                  mon: form.schedule_mon!,
                  tue: form.schedule_tue!,
                  wed: form.schedule_wed!,
                  thu: form.schedule_thu!,
                  fri: form.schedule_fri!,
                  sat: form.schedule_sat!,
                  sun: form.schedule_sun!
                }}
              />

              <View style={styles.deleteScheduleButtonWrapper}>
                <Pressable style={styles.deleteScheduleButton} onPress={deleteSchedule}>
                  <Text style={styles.deleteScheduleButtonText}>삭제하기</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={styles.addScheduleButton}
              onPress={() => navigation.navigate('SearchSchedule', {options: {multiple: false}})}>
              <View style={styles.addScheduleIcon}>
                <PlusIcon width={18} height={18} stroke="#ffffff" strokeWidth={3} />
              </View>

              <Text style={styles.addScheduleButtonText}>일정 선택하기</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <Pressable style={submitButtonStyle} onPress={handleConfirm}>
        <Text style={submitButtonTextStyle}>{form.routine_id ? '수정하기' : '등록하기'}</Text>
      </Pressable>
      <RepeatCountSelectorBottomSheet value={form.repeat_complete_count} onChange={changeRepeatCount} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  listContainer: {
    flex: 1,
    paddingBottom: 80
  },
  topWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 20,
    backgroundColor: '#ffffff'
  },
  bottomWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 15,
    backgroundColor: '#ffffff'
  },
  separator: {
    height: 10,
    backgroundColor: '#f5f6f8'
  },
  input: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  },
  label: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B727E'
  },
  repeatContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },
  repeatContainerLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B727E'
  },
  repeatTypeWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 20
  },
  repeatTypeButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  repeatTypeButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  repeatCountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  repeatCountButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 38,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  repeatCountButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242',
    paddingHorizontal: 15
  },
  scheduleWrapper: {
    gap: 10
  },
  deleteScheduleButtonWrapper: {
    alignItems: 'center'
  },
  deleteScheduleButton: {
    paddingHorizontal: 20,
    height: 48,
    justifyContent: 'center'
  },
  deleteScheduleButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#babfc5'
  },
  addScheduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addScheduleButton: {
    height: 157,
    gap: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addScheduleButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#babfc5'
  },
  submitButton: {
    height: 56,
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8'
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#babfc5'
  }
})

const activeRepeatTypeButtonStyle = StyleSheet.compose(styles.repeatTypeButton, {backgroundColor: '#1E90FF'})
const activeRepeatTypeButtonTextStyle = StyleSheet.compose(styles.repeatTypeButtonText, {
  fontFamily: 'Pretendard-SemiBold',
  color: '#ffffff'
})

const disabledRepeatCountButtonTextStyle = StyleSheet.compose(styles.repeatCountButtonText, {color: '#c3c5cc'})

const activeSubmitButton = StyleSheet.compose(styles.submitButton, {backgroundColor: '#1E90FF'})
const activeSubmitButtonText = StyleSheet.compose(styles.submitButtonText, {color: '#ffffff'})

export default EditRoutine
