import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'
import PlusIcon from '@/assets/icons/plus.svg'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {searchScheduleResultListState} from '@/store/schedule'
import {bottomSafeAreaColorState} from '@/store/system'

import {useMutation} from '@tanstack/react-query'
import {todoRepository} from '@/repository'
import {EditRoutineScreenProps} from '@/types/navigation'

const EditRoutine = ({navigation}: EditRoutineScreenProps) => {
  const isFocused = useIsFocused()

  const [form, setForm] = useState<TodoDetail>({
    todo_id: null,
    title: '',
    complete_date_List: null,

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
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)

  const {mutate: setRoutineMutate} = useMutation({
    mutationFn: () => {
      const params = {
        title: form.title,
        start_date: form.schedule_start_date!,
        schedule_id: form.schedule_id!
      }

      if (form.todo_id) {
        return todoRepository.updateRoutine(params)
      } else {
        return todoRepository.setRoutine(params)
      }
    },
    onSuccess: () => {
      navigation.navigate('MainTabs', {screen: 'Sprout'})
    }
  })

  const activeSubmit = useMemo(() => {
    return !!(form.title && form.schedule_id)
  }, [form.title, form.schedule_id])

  const submitButtonStyle = useMemo(() => {
    return activeSubmit ? activeSubmitButton : styles.submitButton
  }, [activeSubmit])

  const submitButtonTextStyle = useMemo(() => {
    return activeSubmit ? activeSubmitButtonText : styles.submitButtonText
  }, [activeSubmit])

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

  const handleConfirm = useCallback(() => {
    setRoutineMutate()
  }, [setRoutineMutate])

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
        {/* 루틴명 */}
        <TextInput
          placeholder="새로운 루틴"
          placeholderTextColor="#c3c5cc"
          autoFocus
          style={styles.input}
          onChangeText={(value: string) => setForm(prevState => ({...prevState, title: value}))}
        />

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
      </ScrollView>

      <Pressable style={submitButtonStyle} onPress={handleConfirm}>
        <Text style={submitButtonTextStyle}>{form.todo_id ? '수정하기' : '등록하기'}</Text>
      </Pressable>
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
    gap: 20,
    paddingBottom: 80,
    paddingHorizontal: 16
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

const activeSubmitButton = StyleSheet.compose(styles.submitButton, {backgroundColor: '#1E90FF'})
const activeSubmitButtonText = StyleSheet.compose(styles.submitButtonText, {color: '#ffffff'})

export default EditRoutine
