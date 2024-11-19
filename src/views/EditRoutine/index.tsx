import React, {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View, Text, TextInput, Pressable, ScrollView} from 'react-native'
import AppBar from '@/components/AppBar'
import CompleteCalendar from './components/CompleteCalendar'
import YearMonthPickerModal from '@/components/modal/YearMonthPickerModal'
import DeleteIcon from '@/assets/icons/trash.svg'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {activeThemeState, alertState} from '@/store/system'
import {scheduleListState, scheduleState} from '@/store/schedule'
import {useDeleteRoutine, useGetRoutineDetail, useSetRoutine, useUpdateRoutine} from '@/apis/hooks/useRoutine'
import {EditRoutineScreenProps} from '@/types/navigation'

const EditRoutine = ({navigation, route}: EditRoutineScreenProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showYearMonthPickerModal, setShowYearMonthPickerModal] = useState(false)

  const {mutateAsync: getRoutineDetailMutateAsync} = useGetRoutineDetail()
  const {mutateAsync: setRoutineMutateAsync} = useSetRoutine()
  const {mutateAsync: updateRoutineMutateAsync} = useUpdateRoutine()
  const {mutate: deleteRoutineMutate, isSuccess: isSuccessDeleteRoutine} = useDeleteRoutine()

  const [editRoutineForm, setEditRoutineForm] = useState<EditRoutineForm>({
    routine_id: null,
    title: '',
    schedule_id: null
  })

  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)

  const activeTheme = useRecoilValue(activeThemeState)
  const schedule = useRecoilValue(scheduleState)
  const alert = useSetRecoilState(alertState)

  const isUpdate = useMemo(() => {
    return !!editRoutineForm.routine_id
  }, [editRoutineForm.routine_id])

  const targetSchedule = useMemo(() => {
    if (editRoutineForm.schedule_id) {
      return scheduleList.find(item => item.schedule_id === editRoutineForm.schedule_id)
    }

    return schedule
  }, [editRoutineForm.schedule_id, scheduleList, schedule])

  const changeTitle = useCallback(
    (value: string) => {
      setEditRoutineForm(prevState => ({
        ...prevState,
        title: value
      }))
    },
    [setEditRoutineForm]
  )

  const getNewScheduleList = useCallback(
    (newRoutineId: number) => {
      return scheduleList.map(item => {
        if (item.schedule_id === targetSchedule?.schedule_id) {
          let newRoutineList = [...item.routine_list]

          const updateRoutineIndex = newRoutineList.findIndex(routineItem => routineItem.routine_id === newRoutineId)

          const newRoutine: ScheduleRoutine = {
            routine_id: newRoutineId!,
            title: editRoutineForm.title,
            schedule_id: targetSchedule.schedule_id!,
            complete_id: updateRoutineIndex !== -1 ? newRoutineList[updateRoutineIndex].complete_id : null,
            complete_date: updateRoutineIndex !== -1 ? newRoutineList[updateRoutineIndex].complete_date : null,
            complete_date_list: updateRoutineIndex !== -1 ? newRoutineList[updateRoutineIndex].complete_date_list : []
          }

          if (updateRoutineIndex === -1) {
            newRoutineList.push(newRoutine)
          } else {
            newRoutineList[updateRoutineIndex] = newRoutine
          }

          return {
            ...item,
            routine_list: newRoutineList
          }
        }

        return item
      })
    },
    [targetSchedule?.schedule_id, scheduleList, editRoutineForm.title]
  )

  const handleSubmit = useCallback(async () => {
    let resultId: number | null = null

    if (editRoutineForm.routine_id) {
      resultId = await updateRoutineMutateAsync({
        title: editRoutineForm.title,
        routine_id: editRoutineForm.routine_id
      })
    } else {
      if (!targetSchedule?.schedule_id) {
        throw new Error('잘못된 일정')
      }

      resultId = await setRoutineMutateAsync({
        title: editRoutineForm.title,
        schedule_id: targetSchedule.schedule_id
      })
    }

    if (resultId === null) {
      throw new Error('잘못된 루틴')
    }

    const newScheduleList = getNewScheduleList(resultId)

    setScheduleList(newScheduleList)

    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {scheduleUpdated: true}
    })
  }, [
    targetSchedule,
    editRoutineForm.routine_id,
    editRoutineForm.title,
    updateRoutineMutateAsync,
    setRoutineMutateAsync,
    getNewScheduleList,
    setScheduleList,
    navigation
  ])

  const handleDelete = useCallback(() => {
    alert({
      type: 'danger',
      title: '루틴을 삭제할까요?',
      confirmButtonText: '삭제하기',
      confirmFn: () => {
        if (editRoutineForm.routine_id) {
          deleteRoutineMutate(editRoutineForm.routine_id)
        }
      }
    })
  }, [alert, editRoutineForm.routine_id, deleteRoutineMutate])

  useEffect(() => {
    if (isSuccessDeleteRoutine) {
      const newScheduleList = scheduleList.map(scheduleItem => {
        const newRoutineList = scheduleItem.routine_list.filter(routineItem => {
          return routineItem.routine_id !== editRoutineForm.routine_id
        })

        return {
          ...scheduleItem,
          routine_list: newRoutineList
        }
      })

      setScheduleList(newScheduleList)

      navigation.navigate('MainTabs', {
        screen: 'Home',
        params: {scheduleUpdated: true}
      })
    }
  }, [isSuccessDeleteRoutine, editRoutineForm.routine_id, setScheduleList, navigation])

  useEffect(() => {
    const init = async () => {
      if (route.params.routineId) {
        const routineDetail = await getRoutineDetailMutateAsync(route.params.routineId)

        setEditRoutineForm(routineDetail)
      } else {
        setEditRoutineForm(prevState => ({
          ...prevState,
          schedule_id: route.params.scheduleId
        }))
      }
    }

    init()
  }, [route.params.scheduleId, route.params.routineId, getRoutineDetailMutateAsync])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color1}]}>
      <AppBar backPress>
        {isUpdate && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <DeleteIcon width={24} height={24} fill={activeTheme.color8} />
          </Pressable>
        )}
      </AppBar>

      <ScrollView contentContainerStyle={styles.listContainer} bounces={false} showsVerticalScrollIndicator={false}>
        {targetSchedule && (
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>{targetSchedule.title} </Text>
            <Text style={styles.subLabel}>{isUpdate ? '일정의 루틴' : '일정에 루틴 추가하기'}</Text>
          </View>
        )}

        <TextInput
          value={editRoutineForm.title}
          autoFocus={!route.params.routineId}
          style={[styles.title, {color: activeTheme.color3}]}
          placeholder="새로운 루틴"
          placeholderTextColor="#c3c5cc"
          onChangeText={changeTitle}
        />

        {editRoutineForm.routine_id && (
          <View style={styles.completeCalendarWrapper}>
            <CompleteCalendar
              value={currentDate}
              id={editRoutineForm.routine_id}
              openYearMonthPickerModal={() => setShowYearMonthPickerModal(true)}
            />
          </View>
        )}
      </ScrollView>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{isUpdate ? '수정하기' : '추가하기'}</Text>
      </Pressable>

      <YearMonthPickerModal
        visible={showYearMonthPickerModal}
        value={currentDate}
        onChange={setCurrentDate}
        onClose={() => setShowYearMonthPickerModal(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 112
  },
  labelWrapper: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold'
  },
  subLabel: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium'
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },

  completeCalendarWrapper: {
    paddingTop: 40
  },

  deleteButton: {
    height: 48,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 16
  },
  submitButton: {
    height: 52,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 10
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default EditRoutine
