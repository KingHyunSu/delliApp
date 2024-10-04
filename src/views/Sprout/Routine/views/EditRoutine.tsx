import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'
import PlusIcon from '@/assets/icons/plus.svg'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleDateState, searchScheduleResultListState} from '@/store/schedule'
import {alertState, bottomSafeAreaColorState} from '@/store/system'

import {useMutation, useQueryClient} from '@tanstack/react-query'
import {todoRepository} from '@/repository'
import {EditRoutineScreenProps} from '@/types/navigation'
import {DeleteTodo} from '@/repository/types/todo'

const EditRoutine = ({navigation, route}: EditRoutineScreenProps) => {
  const isFocused = useIsFocused()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<TodoDetail>({
    todo_id: null,
    title: '',

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
  const scheduleDate = useRecoilValue(scheduleDateState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)
  const alert = useSetRecoilState(alertState)

  const {mutate: setRoutineMutate} = useMutation({
    mutationFn: () => {
      const params = {
        todo_id: form.todo_id,
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
      queryClient.invalidateQueries({queryKey: ['routineList']})
      queryClient.invalidateQueries({queryKey: ['scheduleList', scheduleDate]})
      navigation.navigate('MainTabs', {screen: 'Sprout'})
    }
  })

  const {mutate: deleteRoutineMutate} = useMutation({
    mutationFn: (params: DeleteTodo) => {
      return todoRepository.deleteTodo(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['routineList']})
      queryClient.invalidateQueries({queryKey: ['scheduleList', scheduleDate]})
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

  const handleDelete = useCallback(() => {
    alert({
      type: 'danger',
      title: '루틴을 삭제할까요?',
      confirmButtonText: '삭제하기',
      confirmFn: () => {
        if (form.todo_id) {
          deleteRoutineMutate({todo_id: form.todo_id})
        }
      }
    })
  }, [form.todo_id, deleteRoutineMutate])

  // 일정 선택
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

  // bottom safe area color 제어
  useEffect(() => {
    if (isFocused) {
      if (activeSubmit) {
        setBottomSafeAreaColor('#1E90FF')
      } else {
        setBottomSafeAreaColor('#f5f6f8')
      }
    }
  }, [isFocused, activeSubmit, setBottomSafeAreaColor])

  useEffect(() => {
    const {data} = route.params

    if (data) {
      setForm(data)
    }
  }, [route.params.data, setForm])

  return (
    <View style={styles.container}>
      <AppBar backPress>
        {form.todo_id && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>삭제하기</Text>
          </Pressable>
        )}
      </AppBar>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} bounces={false}>
        <TextInput
          value={form.title}
          placeholder="새로운 루틴"
          placeholderTextColor="#c3c5cc"
          autoFocus
          style={styles.input}
          onChangeText={(value: string) => setForm(prevState => ({...prevState, title: value}))}
        />

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleLabel}>어떤 일정에 루틴을 추가할까요?</Text>
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
    gap: 40,
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
  scheduleContainer: {
    gap: 10
  },
  scheduleWrapper: {
    gap: 10
  },
  scheduleLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B727E'
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
  },
  deleteButton: {
    height: 42,
    justifyContent: 'center'
  },
  deleteButtonText: {
    paddingHorizontal: 16,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ff4160'
  }
})

const activeSubmitButton = StyleSheet.compose(styles.submitButton, {backgroundColor: '#1E90FF'})
const activeSubmitButtonText = StyleSheet.compose(styles.submitButtonText, {color: '#ffffff'})

export default EditRoutine
